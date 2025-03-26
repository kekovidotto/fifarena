import { db } from "@/lib/prisma";
import { GroupsDisplay } from "@/components/groups-display";
import { GenerateGroupsButton } from "@/components/generate-groups-button";
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <div className="flex gap-4 items-center">
          <Link
            href="/matches"
            className="text-white hover:text-primary/80 underline transition-colors"
          >
            Ver Partidas
          </Link>
          <GenerateGroupsButton hasExistingGroups={existingGroups.length > 0} />
        </div>
      </div>

      <GroupsDisplay groups={existingGroups} />
    </div>
  );
}