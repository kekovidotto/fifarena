import { db } from "@/lib/prisma";
import { GroupMatches } from "@/components/group-matches";
import Link from "next/link";

export default async function MatchesPage() {
  // Buscar todos os grupos com suas partidas
  const groups = await db.group.findMany({
    include: {
      matches: {
        include: {
          player1: true,
          player2: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Partidas dos Grupos</h1>
        <Link 
          href="/groups" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Ver Classificação
        </Link>
      </div>
      
      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p>Nenhuma partida encontrada. Gere os grupos primeiro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {groups.map((group) => (
            <GroupMatches 
              key={group.id} 
              matches={group.matches} 
              groupName={group.name} 
            />
          ))}
        </div>
      )}
    </div>
  );
}