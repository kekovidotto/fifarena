"use server"

import { db } from "@/lib/prisma";

export async function resetChampionship() {
  try {
    // Deletar todos os matches primeiro por causa das foreign keys
    await db.match.deleteMany();
    
    // Deletar todos os grupos
    await db.group.deleteMany();
    
    // Deletar todos os players
    await db.player.deleteMany();
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao resetar campeonato:", error);
    return { success: false, error: "Erro ao resetar o campeonato" };
  }
}