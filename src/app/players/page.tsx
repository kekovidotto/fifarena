import React from "react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getPlayers } from "@/data/get-players";
import { Button } from "@/components/ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Playerscolumns } from "./_columns";
import AddPlayersButton from "./add-players-button";
import Link from "next/link";

interface PlayerPageProps {
  params: Promise<{ name: string; team: string }>;
}

const PlayersPage = async ({ params }: PlayerPageProps) => {
  const { name, team } = await params;
  const players = await getPlayers({ name, team });
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* TITULO E BOTAO DE CADASTRO */}
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Lista de Jogadores Existentes</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/groups"
            className="text-white hover:text-primary/80 underline transition-colors text-sm sm:text-base"
          >
            Ver Grupos
          </Link>
          <AddPlayersButton />
        </div>
      </div>
      <DataTable columns={Playerscolumns} data={players} />
    </div>
  );
};

export default PlayersPage;
