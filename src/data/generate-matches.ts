import { db } from "@/lib/prisma";
import type { Group, Player } from "@prisma/client";

interface Match {
  player1Id: number;
  player2Id: number;
}

// Função para embaralhar array (algoritmo Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Gera partidas no formato round-robin (todos contra todos)
function generateRoundRobinMatches(players: Player[]): Match[] {
  const matches: Match[] = [];
  
  // Gera todos os confrontos possíveis
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        player1Id: players[i].id,
        player2Id: players[j].id,
      });
    }
  }

  // Embaralha os confrontos
  let shuffledMatches = shuffleArray([...matches]);

  // Reordena para evitar jogos consecutivos do mesmo jogador
  const finalMatches: Match[] = [];
  const playerLastMatch: { [key: number]: number } = {};
  const remainingMatches: Match[] = [];

  // Primeira passagem: tenta manter intervalo ideal entre jogos
  for (const match of shuffledMatches) {
    const player1LastMatch = playerLastMatch[match.player1Id] ?? -3;
    const player2LastMatch = playerLastMatch[match.player2Id] ?? -3;
    
    // Se algum dos jogadores jogou recentemente, move para a lista de espera
    if (finalMatches.length - player1LastMatch < 2 || 
        finalMatches.length - player2LastMatch < 2) {
      remainingMatches.push(match);
      continue;
    }

    finalMatches.push(match);
    playerLastMatch[match.player1Id] = finalMatches.length - 1;
    playerLastMatch[match.player2Id] = finalMatches.length - 1;
  }

  // Segunda passagem: encaixa os jogos restantes no melhor momento possível
  while (remainingMatches.length > 0) {
    let bestMatchIndex = -1;
    let bestGap = -1;

    for (let i = 0; i < remainingMatches.length; i++) {
      const match = remainingMatches[i];
      const player1LastMatch = playerLastMatch[match.player1Id] ?? -3;
      const player2LastMatch = playerLastMatch[match.player2Id] ?? -3;
      const gap = Math.min(
        finalMatches.length - player1LastMatch,
        finalMatches.length - player2LastMatch
      );

      if (gap > bestGap) {
        bestGap = gap;
        bestMatchIndex = i;
      }
    }

    const match = remainingMatches.splice(bestMatchIndex, 1)[0];
    finalMatches.push(match);
    playerLastMatch[match.player1Id] = finalMatches.length - 1;
    playerLastMatch[match.player2Id] = finalMatches.length - 1;
  }

  return finalMatches;
}

// Função principal para gerar partidas para um grupo
export async function generateMatchesForGroup(group: Group & { players: Player[] }) {
  try {
    const matches = generateRoundRobinMatches(group.players);

    // Criar as partidas no banco
    const createdMatches = await Promise.all(
      matches.map((match) =>
        db.match.create({
          data: {
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            phase: "Grupos",
            groupId: group.id,
          },
        })
      )
    );

    return createdMatches;
  } catch (error) {
    console.error(`Erro ao gerar partidas para o grupo ${group.id}:`, error);
    throw error;
  }
}

// Função para gerar partidas para todos os grupos
export async function generateMatchesForAllGroups() {
  try {
    // Buscar todos os grupos que não têm partidas
    const groups = await db.group.findMany({
      where: {
        matches: {
          none: {} // grupos que não têm partidas
        }
      },
      include: {
        players: true,
      }
    });

    if (groups.length === 0) {
      return [];
    }

    // Gerar partidas para cada grupo
    const allMatches = await Promise.all(
      groups.map(group => generateMatchesForGroup(group))
    );

    return allMatches.flat();
  } catch (error) {
    console.error("Erro ao gerar partidas para os grupos:", error);
    throw error;
  }
}