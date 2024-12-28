import {FocusTask} from "@prisma/client";

type CreateFocusTaskType = Omit<FocusTask, "id" | "totalFocusSeconds" | "isComplete" | "createdAt">

type UpdateFocusTaskType = Omit<FocusTask, "userId" | "createdAt">

type UpsertFocusTaskType = CreateFocusTaskType & Partial<UpdateFocusTaskType>

export type {
	CreateFocusTaskType,
	UpdateFocusTaskType,
	UpsertFocusTaskType
}