"use server";

import { generateGroups } from "@/data/generate-groups";
import { revalidatePath } from "next/cache";

export async function generateGroupsAction() {
  try {
    const groups = await generateGroups();
    
    // Revalidar ambas as páginas
    revalidatePath("/groups");
    revalidatePath("/matches");
    
    return { success: true, data: groups };
  } catch (error) {
    console.error("[GENERATE_GROUPS_ACTION]", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao gerar grupos" 
    };
  }
}