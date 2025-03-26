"use server"
import { db } from "@/lib/prisma"
import { addPlayersSchema } from "./schema"
import { revalidatePath } from "next/cache";

interface AddPlayersParams {
    name: string;
    team: string;
}

export const addPlayers = async ( params: AddPlayersParams) => {
    addPlayersSchema.parse(params)
    await db.player.create({
        data: params
    })
    revalidatePath("/")
}