"use server"

import { db } from "@/lib/prisma";

export async function resetChampionship() {
  try {
    console.log('Iniciando reset do campeonato...');
    
    // Verificar conexão com o banco
    try {
      await db.$connect();
      console.log('Conexão com o banco estabelecida com sucesso');
    } catch (error: any) {
      console.error('Erro de conexão:', error);
      throw new Error(`Falha na conexão com o banco: ${error.message}`);
    }

    // Verificar contagem inicial de registros
    const counts = await db.$transaction([
      db.match.count(),
      db.group.count(),
      db.player.count()
    ]);
    console.log('Contagem inicial:', {
      matches: counts[0],
      groups: counts[1],
      players: counts[2]
    });
    
    // Usando transação para garantir que todas as operações sejam executadas ou nenhuma
    await db.$transaction(async (tx) => {
      // Matches primeiro pois têm referências para players e groups
      console.log('Iniciando deleção de matches...');
      try {
        await tx.match.deleteMany();
        console.log('Matches deletados com sucesso');
      } catch (e) {
        console.error('Erro ao deletar matches:', e);
        throw e;
      }

      // Groups depois pois players têm referência para groups
      console.log('Iniciando deleção de grupos...');
      try {
        await tx.group.deleteMany();
        console.log('Grupos deletados com sucesso');
      } catch (e) {
        console.error('Erro ao deletar grupos:', e);
        throw e;
      }

      // Players por último pois não têm dependências
      console.log('Iniciando deleção de players...');
      try {
        await tx.player.deleteMany();
        console.log('Players deletados com sucesso');
      } catch (e) {
        console.error('Erro ao deletar players:', e);
        throw e;
      }
    });

    // Verificar contagem final de registros
    const finalCounts = await db.$transaction([
      db.match.count(),
      db.group.count(),
      db.player.count()
    ]);
    console.log('Contagem final:', {
      matches: finalCounts[0],
      groups: finalCounts[1],
      players: finalCounts[2]
    });

    console.log('Reset do campeonato concluído com sucesso');
    return { success: true };
  } catch (error: any) {
    // Log mais detalhado do erro
    console.error("Erro detalhado ao resetar campeonato:", {
      message: error.message || 'Mensagem de erro não disponível',
      stack: error.stack || 'Stack não disponível',
      name: error.name || 'Nome do erro não disponível',
      type: error instanceof Error ? 'Error' : typeof error
    });
    
    return {
      success: false,
      error: `Erro ao resetar o campeonato: ${error.message || 'Erro desconhecido'}`
    };
  }
}