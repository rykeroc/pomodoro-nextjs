"use client"

import {useMutation, UseMutationResult, useQuery, UseQueryResult} from "@tanstack/react-query";
import {getFocusTasks, upsertFocusTask} from "@/app/_lib/actions/data/focusTasks/focusTasksActions";
import {FocusTask} from "@prisma/client";
import {UpsertFocusTaskType} from "@/app/_lib/actions/data/focusTasks/types";
import {Dispatch, SetStateAction, useState} from "react";

export interface IFocusTasksData {
	activeTask: FocusTask | null
	setActiveTask: Dispatch<SetStateAction<FocusTask | null>>
	dataQuery:  UseQueryResult<FocusTask[], Error>
	dataMutation:  UseMutationResult<FocusTask, Error, UpsertFocusTaskType>
}

export default function useFocusTasksData(userId: string): IFocusTasksData {
	const [activeTask, setActiveTask] = useState<FocusTask | null>(null)

	const query = useQuery({
		queryFn: async () => getFocusTasks(userId),
		queryKey: [userId]
	})

	const mutation = useMutation({
		mutationFn: async (focusTask: UpsertFocusTaskType) => {
			return await upsertFocusTask(focusTask)
		}
	})

	return {
		activeTask,
		setActiveTask,
		dataQuery: query,
		dataMutation: mutation
	}
}