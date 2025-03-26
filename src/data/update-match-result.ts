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

    // 2. Calcular os pontos do resultado anterior (para subtrair)
    let oldPoints1 = 0;
    let oldPoints2 = 0;

    if (match.score1 !== null && match.score2 !== null) {
      if (match.score1 > match.score2) {
        oldPoints1 = 3;
      } else if (match.score2 > match.score1) {
        oldPoints2 = 3;
      } else {
        oldPoints1 = 1;
        oldPoints2 = 1;
      }
    }

    // 3. Calcular os novos pontos
    let newPoints1 = 0;
    let newPoints2 = 0;

    if (score1 > score2) {
      newPoints1 = 3;
    } else if (score2 > score1) {
      newPoints2 = 3;
    } else {
      newPoints1 = 1;
      newPoints2 = 1;
    }

    // 4. Atualizar a partida com o novo placar
    await tx.match.update({
      where: { id: matchId },
      data: {
        score1,
        score2,
      },
    });

    // 5. Atualizar o jogador 1: subtrair pontos/gols antigos e adicionar novos
    await tx.player.update({
      where: { id: match.player1Id },
      data: {
        points: {
          increment: newPoints1 - oldPoints1
        },
        goalsFor: {
          increment: score1 - (match.score1 ?? 0)
        },
        goalsAgainst: {
          increment: score2 - (match.score2 ?? 0)
        }
      },
    });

    // 6. Atualizar o jogador 2: subtrair pontos/gols antigos e adicionar novos
    await tx.player.update({
      where: { id: match.player2Id },
      data: {
        points: {
          increment: newPoints2 - oldPoints2
        },
        goalsFor: {
          increment: score2 - (match.score2 ?? 0)
        },
        goalsAgainst: {
          increment: score1 - (match.score1 ?? 0)
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