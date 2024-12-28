"use client"

import {useMutation, UseMutationResult, useQuery, UseQueryResult} from "@tanstack/react-query";
import {
	deleteFocusTask,
	getFocusTasks,
} from "@/app/_lib/actions/focusTasks/focusTasksActions";
import {FocusTask} from "@prisma/client";
import {Dispatch, SetStateAction, useState} from "react";

export interface IFocusTasksData {
	activeTask: FocusTask | null
	setActiveTask: Dispatch<SetStateAction<FocusTask | null>>
	query:  UseQueryResult<FocusTask[], Error>
	deleteMutation: UseMutationResult<FocusTask, Error, string>
}

export default function useFocusTasksData(userId: string): IFocusTasksData {
	const [activeTask, setActiveTask] = useState<FocusTask | null>(null)

	const query = useQuery({
		queryFn: async () => getFocusTasks(userId),
		queryKey: [userId]
	})

	const deleteMutation = useMutation({
		mutationFn: async (focusTaskId: string) => await deleteFocusTask(focusTaskId)
	})

	return {
		activeTask,
		setActiveTask,
		query,
		deleteMutation
	}
}