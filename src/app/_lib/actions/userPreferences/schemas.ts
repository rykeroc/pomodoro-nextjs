import {Prisma} from "@prisma/client";
import {z} from "zod"

const upsertUserPreferencesSchema = z.object({
	userId: z.string().nonempty(),
	themeId: z.number().optional(),
	lastPlaylistUrl: z.string().optional()
}) satisfies z.Schema<Prisma.UserPreferenceUncheckedUpdateInput>

export {
	upsertUserPreferencesSchema,
}