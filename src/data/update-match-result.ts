import { db } from "@/lib/prisma";

interface UpdateMatchResultParams {
  matchId: number;
  score1: number;
  score2: number;
}

export async function updateMatchResult({ matchId, score1, score2 }: UpdateMatchResultParams) {
  return await db.$transaction(async (tx) => {
    // 1. Buscar a partida e os jogadores envolvidos
    const match = await tx.match.findUnique({
      where: { id: matchId },
      include: {
        player1: true,
        player2: true,
      },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
    }

    // 2. Calcular os pontos baseado no resultado
    let points1 = 0;
    let points2 = 0;

    if (score1 > score2) {
      points1 = 3; // Vitória do jogador 1
    } else if (score2 > score1) {
      points2 = 3; // Vitória do jogador 2
    } else {
      points1 = 1; // Empate
      points2 = 1;
    }

    // 3. Atualizar a partida com o placar
    await tx.match.update({
      where: { id: matchId },
      data: {
        score1,
        score2,
      },
    });

    // 4. Atualizar o jogador 1
    await tx.player.update({
      where: { id: match.player1Id },
      data: {
        points: {
          increment: points1
        },
        goalsFor: {
          increment: score1
        },
        goalsAgainst: {
          increment: score2
        }
      },
    });

    // 5. Atualizar o jogador 2
    await tx.player.update({
      where: { id: match.player2Id },
      data: {
        points: {
          increment: points2
        },
        goalsFor: {
          increment: score2
        },
        goalsAgainst: {
          increment: score1
        }
      },
    });

    // 6. Retornar os dados atualizados
    return await tx.match.findUnique({
      where: { id: matchId },
      include: {
        player1: true,
        player2: true,
        group: {
          include: {
            players: {
              orderBy: {
                points: 'desc'
              }
            }
          }
        }
      }
    });
  });
}