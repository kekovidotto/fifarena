import { z } from "zod";

export const addPlayersSchema = z.object({
    name: z.string().min(1),
    team: z.string().min(1)
})