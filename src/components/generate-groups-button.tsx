"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { generateGroupsAction } from "@/app/_actions/generate-groups";

interface GenerateGroupsButtonProps {
  hasExistingGroups: boolean;
}

export function GenerateGroupsButton({ hasExistingGroups }: GenerateGroupsButtonProps) {
  const [isPending, startTransition] = useTransition();

  async function handleGenerateGroups() {
    startTransition(async () => {
      try {
        const result = await generateGroupsAction();
        
        if (!result.success) {
          alert(result.error);
          return;
        }
      } catch (error) {
        alert("Erro ao gerar grupos. Tente novamente.");
      }
    });
  }

  return (
    <Button 
      onClick={handleGenerateGroups} 
      disabled={isPending || hasExistingGroups}
    >
      {isPending ? "Gerando grupos..." : "Gerar Grupos"}
    </Button>
  );
}