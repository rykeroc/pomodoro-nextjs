import {Prisma} from "@prisma/client";
import {z} from "zod"

const createFocusTaskSchema = z.object({
	name: z
		.string()
		.nonempty({
			message: "Name must be between 1 and 50 characters"
		})
		.min(1, {
			message: "Name must be between 1 and 50 characters"
		})
		.max(50, {
			message: "Name must be between 1 and 50 characters"
		}),
	userId: z
		.string()
		.nonempty()
}) satisfies z.Schema<Prisma.FocusTaskUncheckedCreateInput>

const updateFocusTaskSchema = z.object({
	id: z
		.string()
		.nonempty(),
	name: z
		.string()
		.nonempty()
		.min(1)
		.max(50, {
			message: "name must be between 1 and 50 characters"
		}),
	totalFocusSeconds: z.number().optional(),
	isComplete: z.boolean().optional(),
}) satisfies z.Schema<Prisma.FocusTaskUncheckedUpdateInput>

export {
	createFocusTaskSchema,
	updateFocusTaskSchema,
}