"use server"

import { db } from "@/lib/prisma";

export async function resetChampionship() {
  try {
    console.log('Iniciando reset do campeonato...');
    
    // Usando transação para garantir que todas as operações sejam executadas ou nenhuma
    await db.$transaction(async (tx) => {
      console.log('Iniciando deleção de matches...');
      await tx.match.deleteMany();
      console.log('Matches deletados com sucesso');

      console.log('Iniciando deleção de grupos...');
      await tx.group.deleteMany();
      console.log('Grupos deletados com sucesso');

      console.log('Iniciando deleção de players...');
      await tx.player.deleteMany();
      console.log('Players deletados com sucesso');
    });

    console.log('Reset do campeonato concluído com sucesso');
    return { success: true };
  } catch (error) {
    // Log mais detalhado do erro
    console.error("Erro detalhado ao resetar campeonato:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return {
      success: false,
      error: `Erro ao resetar o campeonato: ${error.message}`
    };
  }
}