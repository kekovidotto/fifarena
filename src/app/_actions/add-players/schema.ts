import { z } from "zod";

export const upsertPlayersSchema = z.object({
    name: z.string().min(1),
    team: z.string().min(1)
})