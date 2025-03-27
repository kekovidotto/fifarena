import { db } from "@/lib/prisma";
import { GroupsDisplay } from "@/components/groups-display";
import { GenerateGroupsButton } from "@/components/generate-groups-button";
import { GenerateKnockoutButton } from "@/components/generate-knockout-button";
import Link from "next/link";

export default async function GroupsPage() {
  // Buscar grupos existentes com jogadores e suas partidas
  const existingGroups = await db.group.findMany({
    include: {
      players: {
        include: {
          matchesAsPlayer1: true,
          matchesAsPlayer2: true,
        }
      },
      matches: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Grupos</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/matches"
              className="text-white hover:text-primary/80 underline transition-colors text-sm sm:text-base"
            >
              Ver Partidas
            </Link>
            <Link
              href="/knockout"
              className="text-white hover:text-primary/80 underline transition-colors text-sm sm:text-base"
            >
              Fase Eliminatória
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <GenerateGroupsButton hasExistingGroups={existingGroups.length > 0} />
            {existingGroups.length > 0 && <GenerateKnockoutButton />}
          </div>
        </div>
      </div>

      <GroupsDisplay groups={existingGroups} />
    </div>
  );
}