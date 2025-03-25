import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criando Grupos
  const groupA = await prisma.group.create({
    data: {
      name: "Grupo A",
    },
  });

  const groupB = await prisma.group.create({
    data: {
      name: "Grupo B",
    },
  });

  const groupC = await prisma.group.create({
    data: {
      name: "Grupo C",
    },
  });

  // Criando Jogadores
  const player1 = await prisma.player.create({
    data: {
      name: "Felipe",
      team: "Real Madrid",
      groupId: groupA.id,
    },
  });

  const player2 = await prisma.player.create({
    data: {
      name: "Lucas",
      team: "Barcelona",
      groupId: groupA.id,
    },
  });

  const player3 = await prisma.player.create({
    data: {
      name: "Maria",
      team: "Bayern Munich",
      groupId: groupB.id,
    },
  });

  const player4 = await prisma.player.create({
    data: {
      name: "Carlos",
      team: "Chelsea",
      groupId: groupB.id,
    },
  });

  const player5 = await prisma.player.create({
    data: {
      name: "Paula",
      team: "Liverpool",
      groupId: groupC.id,
    },
  });

  const player6 = await prisma.player.create({
    data: {
      name: "João",
      team: "Paris Saint-Germain",
      groupId: groupC.id,
    },
  });

  // Criando Partidas
  const match1 = await prisma.match.create({
    data: {
      player1Id: player1.id,
      player2Id: player2.id,
      score1: 3,
      score2: 1,
      phase: "Grupos",
      groupId: groupA.id,
    },
  });

  const match2 = await prisma.match.create({
    data: {
      player1Id: player3.id,
      player2Id: player4.id,
      score1: 2,
      score2: 2,
      phase: "Grupos",
      groupId: groupB.id,
    },
  });

  const match3 = await prisma.match.create({
    data: {
      player1Id: player5.id,
      player2Id: player6.id,
      score1: 1,
      score2: 0,
      phase: "Grupos",
      groupId: groupC.id,
    },
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
