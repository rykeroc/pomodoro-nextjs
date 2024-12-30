"use server"

import {FocusTask} from "@prisma/client";
import {prisma} from "@/prisma";
import {
	createFocusTaskSchema,
	updateFocusTaskSchema,
} from "@/app/_lib/actions/focusTasks/schemas";

async function createFocusTask(formData: FormData): Promise<FocusTask> {
	const validatedFields = await createFocusTaskSchema.safeParseAsync({
		name: formData.get("name"),
		userId: formData.get("userId")
	})

	if (validatedFields.error){
		throw new Error(validatedFields.error.errors[0].message)
	}

	return prisma.focusTask.create({
		data: {
			name: validatedFields.data.name,
			userId: validatedFields.data.userId
		}
	})
}

async function updateFocusTask(formData: FormData): Promise<FocusTask> {
	const validatedFields = await updateFocusTaskSchema.safeParseAsync({
		id: formData.get("id"),
		name: formData.get("name"),
		totalFocusSeconds: formData.has("totalFocusSeconds") ? parseInt(formData.get("totalFocusSeconds") as string) : undefined,
		isComplete: formData.has("isComplete") ? formData.get("isComplete") === "true" :  undefined
	})

	if (validatedFields.error){
		throw new Error(validatedFields.error.errors[0].message)
	}

	return prisma.focusTask.update({
		where: {
			id: validatedFields.data.id
		},
		data: {
			name: validatedFields.data.name,
			totalFocusSeconds: validatedFields.data.totalFocusSeconds,
			isComplete: validatedFields.data.isComplete
		}
	})
}

async function deleteFocusTask(focusTaskId: string): Promise<FocusTask> {
	return prisma.focusTask.delete({
		where: {
			id: focusTaskId
		}
	})
}
async function getFocusTasks(userId: string): Promise<FocusTask[]> {
	return prisma.focusTask.findMany({
		where: {
			userId: userId
		}
	})
}

export {
	createFocusTask,
	updateFocusTask,
	deleteFocusTask,
	getFocusTasks
}
