import { db } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Partidas dos Grupos</h1>
        <Link
          href="/groups"
          className="text-white hover:text-primary/80 underline transition-colors text-sm sm:text-base"
        >
          Ver Classificação
        </Link>
      </div>
      
      {groups.length === 0 ? (
        <div className="text-center py-6 sm:py-8 card">
          <p className="text-sm sm:text-base">Nenhuma partida encontrada. Gere os grupos primeiro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
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