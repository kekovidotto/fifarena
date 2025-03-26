"use server"
import { db } from "@/lib/prisma"
import { upsertPlayersSchema } from "./schema"
import { revalidatePath } from "next/cache";

interface UpsertPlayersParams {
    id?: number;
    name: string;
    team: string;
}

export const upsertPlayers = async ( params: UpsertPlayersParams) => {
    upsertPlayersSchema.parse(params)
    await db.player.upsert({
        where: {
            id: params.id
        },
        update: { ...params },
        create: { ...params}
    })
    revalidatePath("/")
}