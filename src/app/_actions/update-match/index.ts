"use server";

import { updateMatchResult } from "@/data/update-match-result";
import { revalidatePath } from "next/cache";

export async function updateMatchAction(matchId: number, score1: number, score2: number) {
  try {
    const result = await updateMatchResult({
      matchId,
      score1,
      score2,
    });

    // Revalidar ambas as páginas já que o resultado afeta tanto matches quanto grupos
    revalidatePath("/matches");
    revalidatePath("/groups");

    return { success: true, data: result };
  } catch (error) {
    console.error("[UPDATE_MATCH_ACTION]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar partida",
    };
  }
}