import { db } from "@/lib/prisma";

interface QualifiedTeam {
  playerId: number;
  groupId: number;
  position: number; // 1 para primeiro, 2 para segundo
}

export async function generateKnockoutPhase() {
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

    // 2. Selecionar os 2 primeiros de cada grupo
    const qualifiedTeams: QualifiedTeam[] = [];
    
    for (const group of groups) {
      if (group.players.length >= 2) {
        // Primeiro colocado
        qualifiedTeams.push({
          playerId: group.players[0].id,
          groupId: group.id,
          position: 1
        });
        
        // Segundo colocado
        qualifiedTeams.push({
          playerId: group.players[1].id,
          groupId: group.id,
          position: 2
        });
      }
    }

    // 3. Separar times por colocação
    const firstPlace = qualifiedTeams.filter(team => team.position === 1);
    const secondPlace = qualifiedTeams.filter(team => team.position === 2);

    // 4. Embaralhar os segundos colocados para sortear os confrontos
    const shuffledSecondPlace = [...secondPlace].sort(() => Math.random() - 0.5);

    // 5. Criar os confrontos (1º vs 2º de grupos diferentes)
    const knockoutMatches = firstPlace.map((first, index) => {
      const second = shuffledSecondPlace[index];
      
      // Garantir que times do mesmo grupo não se enfrentem
      if (first.groupId === second.groupId) {
        // Trocar com próximo time (circular se necessário)
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

    // 7. Retornar os confrontos criados com dados dos jogadores
    return await tx.match.findMany({
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
  });
}