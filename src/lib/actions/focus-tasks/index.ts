"use server"

import {FocusTask} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {
	createFocusTaskSchema,
	updateFocusTaskSchema,
} from "@/lib/actions/focus-tasks/schemas";
import {IFocusTaskDeleteArgs, IFocusTaskUpdateArgs} from "@/lib/actions/focus-tasks/types";

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

async function updateFocusTask({formData, userId}: IFocusTaskUpdateArgs): Promise<FocusTask> {
	const validatedFields = await updateFocusTaskSchema.safeParseAsync({
		id: formData.get("id"),
		name: formData.get("name"),
		totalFocusSeconds: formData.has("totalFocusSeconds") ? parseInt(formData.get("totalFocusSeconds") as string) : undefined,
		isComplete: formData.has("isComplete") ? formData.get("isComplete") === "true" :  undefined,
	})

	if (validatedFields.error){
		throw new Error(validatedFields.error.errors[0].message)
	}

	// Fetch the existing focus task and verify ownership
	const existingTask = await prisma.focusTask.findUnique({
		where: { id: validatedFields.data.id },
		select: { userId: true },
	});

	if (!existingTask) {
		throw new Error("Task not found");
	}

	if (existingTask.userId !== userId) {
		throw new Error("Unauthorized: You cannot update this task");
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

async function deleteFocusTask({focusTaskId, userId}: IFocusTaskDeleteArgs): Promise<FocusTask> {
	// Fetch the existing focus task and verify ownership
	const existingTask = await prisma.focusTask.findUnique({
		where: { id: focusTaskId },
		select: { userId: true },
	});

	if (!existingTask) {
		throw new Error("Task not found");
	}

	if (existingTask.userId !== userId) {
		throw new Error("Unauthorized: You cannot delete this task");
	}

	return prisma.focusTask.delete({
		where: {
			id: focusTaskId
		}
	})
}
async function getFocusTasks(userId: string | null): Promise<FocusTask[]> {
	if (!userId) return [] as FocusTask[]

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