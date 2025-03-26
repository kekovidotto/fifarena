"use client";

import { Button } from "@/components/ui/button";
import { generateKnockoutMatches } from "@/app/_actions/generate-knockout-matches";
import { useState } from "react";

export function GenerateKnockoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerateKnockout() {
    if (!confirm("Deseja realmente gerar a fase eliminatória? Isso criará os confrontos do mata-mata com os 2 primeiros de cada grupo.")) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateKnockoutMatches();

      if (!result.success) {
        alert(result.error);
        return;
      }

      alert("Fase eliminatória gerada com sucesso!");
      window.location.href = "/knockout";
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar fase eliminatória");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button 
      onClick={handleGenerateKnockout}
      disabled={isLoading}
      className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold"
    >
      {isLoading ? "Gerando..." : "Gerar Fase Eliminatória"}
    </Button>
  );
}