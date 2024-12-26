import {FocusTask} from "@prisma/client";

type CreateFocusTaskType = Omit<FocusTask, "id" | "totalFocusSeconds" | "isComplete" | "createdAt">

type UpdateFocusTaskType = Omit<FocusTask, "userId" | "createdAt">

export type {
	CreateFocusTaskType,
	UpdateFocusTaskType
}