"use client"

import { Button } from "@/components/ui/button";
import { resetChampionship } from "@/app/_actions/reset-championship";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function ResetChampionshipButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!confirm("Tem certeza que deseja resetar todo o campeonato? Essa ação não pode ser desfeita.")) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetChampionship();
      if (result.success) {
        alert("Campeonato resetado com sucesso!");
        router.refresh(); // Força revalidação dos dados
        router.push('/'); // Volta para a página inicial
      } else {
        alert(result.error || "Erro ao resetar o campeonato");
      }
    } catch (error) {
      alert("Erro ao resetar o campeonato");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleReset}
      disabled={isLoading}
      className="font-bold"
    >
      {isLoading ? (
        "Resetando..."
      ) : (
        <>
          Resetar Campeonato
          <RefreshCcw className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}