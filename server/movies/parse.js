import { z } from 'zod'

const MovieSchema = z.object({
    title: z.string(),
    description: z.string(),
})

export function parseMovie(reqBody) {
    return MovieSchema.safeParse(reqBody)
}
