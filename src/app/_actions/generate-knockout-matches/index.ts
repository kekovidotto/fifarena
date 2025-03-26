"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Match, Player } from "@prisma/client";

interface QualifiedTeam {
  playerId: number;
  groupId: number;
  position: number;
}

type MatchWithPlayers = Match & {
  player1: Player;
  player2: Player;
};

type KnockoutResult = 
  | { success: true; data: MatchWithPlayers[] }
  | { success: false; error: string };

export async function generateKnockoutMatches(): Promise<KnockoutResult> {
  try {
    return await db.$transaction(async (tx) => {
      // 1. Buscar todos os grupos
      const groups = await tx.group.findMany({
        include: {
          players: {
            orderBy: {
              points: 'desc'
            }
          }
        }
      });

      if (groups.length === 0) {
        return { 
          success: false, 
          error: "Não existem grupos criados para gerar a fase eliminatória" 
        };
      }

      // 2. Selecionar os 2 primeiros de cada grupo
      const qualifiedTeams: QualifiedTeam[] = [];
      
      for (const group of groups) {
        if (group.players.length >= 2) {
          qualifiedTeams.push({
            playerId: group.players[0].id,
            groupId: group.id,
            position: 1
          });
          
          qualifiedTeams.push({
            playerId: group.players[1].id,
            groupId: group.id,
            position: 2
          });
        }
      }

      if (qualifiedTeams.length < 2) {
        return {
          success: false,
          error: "Não há jogadores suficientes classificados para gerar a fase eliminatória"
        };
      }

      // 3. Separar times por colocação
      const firstPlace = qualifiedTeams.filter(team => team.position === 1);
      const secondPlace = qualifiedTeams.filter(team => team.position === 2);

      // 4. Embaralhar os segundos colocados
      const shuffledSecondPlace = [...secondPlace].sort(() => Math.random() - 0.5);

      // 5. Criar os confrontos (1º vs 2º de grupos diferentes)
      const knockoutMatches = firstPlace.map((first, index) => {
        const second = shuffledSecondPlace[index];
        
        if (first.groupId === second.groupId) {
          const nextIndex = (index + 1) % shuffledSecondPlace.length;
          const temp = shuffledSecondPlace[index];
          shuffledSecondPlace[index] = shuffledSecondPlace[nextIndex];
          shuffledSecondPlace[nextIndex] = temp;
        }

        return {
          player1Id: first.playerId,
          player2Id: shuffledSecondPlace[index].playerId,
          phase: "Eliminatórias",
        };
      });

      // 6. Criar as partidas no banco
      await tx.match.createMany({
        data: knockoutMatches
      });

      // 7. Retornar os confrontos criados
      const createdMatches = await tx.match.findMany({
        where: {
          phase: "Eliminatórias"
        },
        include: {
          player1: true,
          player2: true
        },
        orderBy: {
          id: 'asc'
        }
      });

      // Revalidar as páginas
      revalidatePath("/knockout");
      revalidatePath("/matches");
      revalidatePath("/groups");

      return { success: true, data: createdMatches };
    });
  } catch (error) {
    console.error("Erro ao gerar mata-mata:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao gerar fase eliminatória"
    };
  }
}