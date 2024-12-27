"use client"

import {useMutation, UseMutationResult, useQuery, UseQueryResult} from "@tanstack/react-query";
import {deleteFocusTask, getFocusTasks, upsertFocusTask} from "@/app/_lib/actions/data/focusTasks/focusTasksActions";
import {FocusTask} from "@prisma/client";
import {UpsertFocusTaskType} from "@/app/_lib/actions/data/focusTasks/types";
import {Dispatch, SetStateAction, useState} from "react";

export interface IFocusTasksData {
	activeTask: FocusTask | null
	setActiveTask: Dispatch<SetStateAction<FocusTask | null>>
	query:  UseQueryResult<FocusTask[], Error>
	upsertMutation: UseMutationResult<FocusTask, Error, UpsertFocusTaskType>
	deleteMutation: UseMutationResult<FocusTask, Error, string>
}

export default function useFocusTasksData(userId: string): IFocusTasksData {
	const [activeTask, setActiveTask] = useState<FocusTask | null>(null)

	const query = useQuery({
		queryFn: async () => getFocusTasks(userId),
		queryKey: [userId]
	})

	const upsertMutation = useMutation({
		mutationFn: async (focusTask: UpsertFocusTaskType) => await upsertFocusTask(focusTask)
	})

	const deleteMutation = useMutation({
		mutationFn: async (focusTaskId: string) => await deleteFocusTask(focusTaskId)
	})

	return {
		activeTask,
		setActiveTask,
		query,
		upsertMutation,
		deleteMutation
	}
}