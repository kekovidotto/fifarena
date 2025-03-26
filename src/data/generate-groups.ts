import { db } from "@/lib/prisma";
import { Player } from "@prisma/client";

type Match = {
  player1Id: number;
  player2Id: number;
  phase: string;
  groupId: number;
};

// Função para gerar as partidas de um grupo garantindo distribuição equilibrada de mandos
function generateGroupMatches(players: Player[], groupId: number): Match[] {
  // Lista de jogadores que ainda não foram player1Id
  let playersNotPlayer1 = [...players];
  const matches: Match[] = [];

  // Gerar confrontos para o grupo
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const player1 = players[i];
      const player2 = players[j];

      // Se a lista de jogadores que não foram player1 estiver vazia, recarregue-a
      if (playersNotPlayer1.length === 0) {
        playersNotPlayer1 = [...players];
      }

      // Determine quem será player1Id com base em quem ainda não jogou como player1
      let match: Match;
      if (playersNotPlayer1.find((p) => p.id === player1.id)) {
        match = {
          player1Id: player1.id,
          player2Id: player2.id,
          phase: "Grupos",
          groupId: groupId,
        };
        // Remove o jogador da lista de não utilizados como player1
        playersNotPlayer1 = playersNotPlayer1.filter(
          (p) => p.id !== player1.id,
        );
      } else if (playersNotPlayer1.find((p) => p.id === player2.id)) {
        match = {
          player1Id: player2.id,
          player2Id: player1.id,
          phase: "Grupos",
          groupId: groupId,
        };
        // Remove o jogador da lista de não utilizados como player1
        playersNotPlayer1 = playersNotPlayer1.filter(
          (p) => p.id !== player2.id,
        );
      } else {
        // Se nenhum dos jogadores está na lista, use o primeiro jogador como player1
        match = {
          player1Id: player1.id,
          player2Id: player2.id,
          phase: "Grupos",
          groupId: groupId,
        };
      }

      matches.push(match);
    }
  }

  return matches;
}

// Função para embaralhar array (algoritmo Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para distribuir jogadores aleatoriamente em grupos
function distributePlayersInGroups(players: Player[], playersPerGroup: number) {
  const shuffledPlayers = shuffleArray([...players]);
  const groups: Player[][] = [];
  const numberOfGroups = Math.ceil(shuffledPlayers.length / playersPerGroup);

  // Criar arrays vazios para cada grupo
  for (let i = 0; i < numberOfGroups; i++) {
    groups.push([]);
  }

  // Distribuir jogadores alternadamente entre os grupos
  let currentGroup = 0;
  for (const player of shuffledPlayers) {
    groups[currentGroup].push(player);
    currentGroup = (currentGroup + 1) % numberOfGroups;
  }

  return groups;
}

export async function generateGroups() {
  try {
    // Usar transação para garantir consistência dos dados
    return await db.$transaction(
      async (tx) => {
        // 1. Buscar todos os jogadores não associados a grupos
        const players = await tx.player.findMany({
          where: {
            groupId: null,
          },
        });

        if (players.length === 0) {
          throw new Error("Não há jogadores disponíveis para gerar grupos");
        }

        // 2. Distribuir jogadores em grupos de forma aleatória
        const playersPerGroup = 4;
        const groupedPlayers = distributePlayersInGroups(
          players,
          playersPerGroup,
        );

        // 3. Criar os grupos e associar os jogadores
        const createdGroups = await Promise.all(
          groupedPlayers.map(async (groupPlayers, index) => {
            const groupName = `Grupo ${String.fromCharCode(65 + index)}`; // Grupo A, B, C, etc.

            // Criar o grupo
            const group = await tx.group.create({
              data: {
                name: groupName,
              },
            });

            // Atualizar os jogadores com o ID do grupo
            await Promise.all(
              groupPlayers.map((player) =>
                tx.player.update({
                  where: { id: player.id },
                  data: { groupId: group.id },
                }),
              ),
            );

            return group;
          }),
        );

        // 4. Gerar as partidas para todos os grupos criados
        for (const group of createdGroups) {
          const groupWithPlayers = await tx.group.findUnique({
            where: { id: group.id },
            include: { players: true },
          });

          if (groupWithPlayers && groupWithPlayers.players.length > 0) {
            const matches = generateGroupMatches(
              groupWithPlayers.players,
              group.id,
            );

            // Criar as partidas no banco
            await Promise.all(
              matches.map((match) =>
                tx.match.create({
                  data: {
                    ...match,
                    createdAt: new Date(),
                  },
                }),
              ),
            );
          }
        }

        // 5. Retornar os grupos gerados com seus jogadores
        return await tx.group.findMany({
          include: {
            players: true,
          },
          orderBy: {
            name: "asc",
          },
        });
      },
      {
        maxWait: 10000, // 10 segundos de espera máxima
        timeout: 30000, // 30 segundos de timeout
      },
    );
  } catch (error) {
    console.error("Erro ao gerar grupos:", error);
    throw error;
  }
}
