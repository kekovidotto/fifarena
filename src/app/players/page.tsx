import React from "react";
import { getPlayers } from "@/data/get-players";
import { Button } from "@/components/ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Playerscolumns } from "./_columns";
import AddPlayersButton from "./add-players-button";

interface PlayerPageProps {
  params: Promise<{ name: string; team: string }>;
}

const PlayersPage = async ({ params }: PlayerPageProps) => {
  const { name, team } = await params;
  const players = await getPlayers({ name, team });
  return (
    <div className="space-y-6 p-6">
      {/* TITULO E BOTAO DE CADASTRO */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Lista de Jogadores Existentes</h1>
        <AddPlayersButton />
      </div>
      <DataTable columns={Playerscolumns} data={players} />
    </div>
  );
};

export default PlayersPage;
