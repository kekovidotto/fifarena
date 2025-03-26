import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { Group, Match, Player } from "@prisma/client";

interface ExtendedPlayer extends Player {
  matchesAsPlayer1: Match[];
  matchesAsPlayer2: Match[];
}

interface GroupsDisplayProps {
  groups: (Group & {
    players: ExtendedPlayer[];
    matches: Match[];
  })[];
}

// Função para calcular o número de jogos de um jogador
function calculateGames(player: ExtendedPlayer): number {
  const jogosPlayer1 = player.matchesAsPlayer1.filter(m => m.score1 !== null && m.score2 !== null).length;
  const jogosPlayer2 = player.matchesAsPlayer2.filter(m => m.score1 !== null && m.score2 !== null).length;
  return jogosPlayer1 + jogosPlayer2;
}

// Função para ordenar jogadores por pontos e saldo de gols
function sortPlayers(players: ExtendedPlayer[]) {
  return [...players].sort((a, b) => {
    // Primeiro critério: pontos
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Segundo critério: saldo de gols
    const saldoA = a.goalsFor - a.goalsAgainst;
    const saldoB = b.goalsFor - b.goalsAgainst;
    if (saldoB !== saldoA) {
      return saldoB - saldoA;
    }
    // Terceiro critério: gols marcados
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    // Quarto critério: ordem alfabética
    return a.name.localeCompare(b.name);
  });
}

export function GroupsDisplay({ groups }: GroupsDisplayProps) {
  if (!groups.length) {
    return (
      <div className="text-center py-8">
        <p>Nenhum grupo criado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.id} className="p-6">
          <h3 className="text-lg font-bold mb-4">{group.name}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">J</TableHead>
                <TableHead className="text-center">SG</TableHead>
                <TableHead className="text-center">GP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortPlayers(group.players).map((player, index) => {
                const saldoGols = player.goalsFor - player.goalsAgainst;
                const jogos = calculateGames(player);

                return (
                  <TableRow key={player.id}>
                    <TableCell>{index + 1}º</TableCell>
                    <TableCell>
                      <div>
                        <div>{player.name}</div>
                        <div className="text-sm text-gray-500">{player.team}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold">{player.points}</TableCell>
                    <TableCell className="text-center">{jogos}</TableCell>
                    <TableCell className="text-center">{saldoGols}</TableCell>
                    <TableCell className="text-center">{player.goalsFor}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
}