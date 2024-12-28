"use server"

import {FocusTask} from "@prisma/client";
import {prisma} from "@/prisma";
import {UpsertFocusTaskType} from "@/app/_lib/actions/focusTasks/types";

async function upsertFocusTask(args: UpsertFocusTaskType): Promise<FocusTask> {
	return prisma.focusTask.upsert({
		create: {
			name: args.name,
			userId: args.userId
		},
		update: {
			name: args.name,
			...(args.totalFocusSeconds !== undefined && { totalFocusSeconds: args.totalFocusSeconds }),
			...(args.isComplete !== undefined && { isComplete: args.isComplete })
		},
		where: {
			id: args.id ?? ''
		},
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
	upsertFocusTask,
	deleteFocusTask,
	getFocusTasks
}
