import React from "react";
import { ResetChampionshipButton } from "@/components/reset-championship-button";
import { StartChampionshipButton } from "@/components/start-championship-button";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 p-6">
      <h1 className="text-4xl font-bold text-center">FIFA Arena</h1>
      <p className="text-white/90 text-center max-w-md">
        Bem-vindo ao gerenciador de campeonato FIFA. Comece cadastrando os jogadores e depois
        organize os grupos e partidas.
      </p>
      <div className="flex flex-col space-y-4 items-center">
        <StartChampionshipButton />
        <ResetChampionshipButton />
      </div>
    </div>
  );
};

export default HomePage;
