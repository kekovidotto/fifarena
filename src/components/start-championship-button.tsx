"use client"

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function StartChampionshipButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/players')}
      className="font-bold"
      size="lg"
    >
      Iniciar Campeonato
      <UserPlus className="ml-2 h-4 w-4" />
    </Button>
  );
}