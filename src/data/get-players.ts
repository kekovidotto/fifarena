import { db } from "@/lib/prisma";

interface PlayerProps {
  name?: string;
  team?: string;
}

export const getPlayers = async ({ name, team }: PlayerProps) => {
  const players = await db.player.findMany({
    where: {
      name: name,
      team: team,
    },
  });
  return players;
};
