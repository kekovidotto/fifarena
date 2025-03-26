"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState } from "react";
import type { Match, Player } from "@prisma/client";
import { updateMatchAction } from "@/app/_actions/update-match";

interface GroupMatchesProps {
  matches: (Match & {
    player1: Player;
    player2: Player;
  })[];
  groupName: string;
}

export function GroupMatches({ matches, groupName }: GroupMatchesProps) {
  const [editingMatch, setEditingMatch] = useState<number | null>(null);
  const [score1, setScore1] = useState<string>("");
  const [score2, setScore2] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdateScore(matchId: number) {
    if (!score1 || !score2) return;

    setIsLoading(true);
    try {
      const result = await updateMatchAction(
        matchId,
        parseInt(score1),
        parseInt(score2)
      );

      if (!result.success) {
        alert(result.error);
        return;
      }

      // Limpar o estado de edição
      setEditingMatch(null);
      setScore1("");
      setScore2("");
    } catch (error) {
      alert("Erro ao atualizar o placar");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="card p-6">
      <h3 className="section-title">Partidas - {groupName}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rodada</TableHead>
            <TableHead>Jogador 1</TableHead>
            <TableHead>Placar</TableHead>
            <TableHead>Jogador 2</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, index) => (
            <TableRow key={match.id}>
              <TableCell className="font-bold text-primary">{index + 1}ª Rodada</TableCell>
              <TableCell className="team-name">{match.player1.name}</TableCell>
              <TableCell>
                {editingMatch === match.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={score1}
                      onChange={(e) => setScore1(e.target.value)}
                      className="w-12 p-1 border rounded bg-secondary/30 text-primary-foreground"
                      min="0"
                    />
                    <span className="score">x</span>
                    <input
                      type="number"
                      value={score2}
                      onChange={(e) => setScore2(e.target.value)}
                      className="w-12 p-1 border rounded bg-secondary/30 text-primary-foreground"
                      min="0"
                    />
                  </div>
                ) : (
                  <span className="score">
                    {match.score1 !== null && match.score2 !== null
                      ? `${match.score1} x ${match.score2}`
                      : "- x -"}
                  </span>
                )}
              </TableCell>
              <TableCell className="team-name">{match.player2.name}</TableCell>
              <TableCell>
                {editingMatch === match.id ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateScore(match.id)}
                      disabled={isLoading}
                      className="soccer-button"
                      size="sm"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingMatch(null);
                        setScore1("");
                        setScore2("");
                      }}
                      variant="outline"
                      size="sm"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setEditingMatch(match.id)}
                    className="soccer-button"
                    size="sm"
                  >
                    {match.score1 !== null ? "Editar" : "Definir"} Placar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}