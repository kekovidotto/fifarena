"use server"
import { db } from "@/lib/prisma"
import { upsertPlayersSchema } from "./schema"
import { revalidatePath } from "next/cache";

interface UpsertPlayersParams {
    id?: number;
    name: string;
    team: string;
}

export const upsertPlayers = async (params: UpsertPlayersParams) => {
    upsertPlayersSchema.parse(params)
    
    if (params.id) {
        // Se tiver ID, atualiza o jogador existente
        await db.player.upsert({
            where: {
                id: params.id
            },
            update: {
                name: params.name,
                team: params.team
            },
            create: {
                name: params.name,
                team: params.team
            }
        })
    } else {
        // Se não tiver ID, cria um novo jogador
        await db.player.create({
            data: {
                name: params.name,
                team: params.team
            }
        })
    }

    revalidatePath("/")
}