"use server"

import {FocusTask} from "@prisma/client";
import {prisma} from "@/prisma";
import {CreateFocusTaskType, UpdateFocusTaskType} from "@/app/_lib/actions/data/focusTasks/types";

async function upsertFocusTask(args : CreateFocusTaskType & UpdateFocusTaskType): Promise<FocusTask>{
	return prisma.focusTask.upsert({
		create: {
			name: args.name,
			order: args.order,
			userId: args.userId
		},
		update: {
			name: args.name,
			order: args.order,
			totalFocusSeconds: args.totalFocusSeconds,
			isComplete: args.isComplete
		},
		where: {
			id: args.id
		},
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
	getFocusTasks
}
