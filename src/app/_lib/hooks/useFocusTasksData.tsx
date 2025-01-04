"use client"

import {useMutation, UseMutationResult, useQuery, UseQueryResult} from "@tanstack/react-query";
import {
	createFocusTask,
	deleteFocusTask,
	getFocusTasks,
	updateFocusTask,
} from "@/app/_lib/actions/focusTasks/focusTasksActions";
import {FocusTask} from "@prisma/client";
import {useState} from "react";
import {IFocusTaskDeleteArgs, IFocusTaskUpdateArgs} from "@/app/_lib/actions/focusTasks/types";

export interface IFocusTasksData {
	activeTask: FocusTask | null
	setActiveTask: (focusTaskId: string | null) => void
	query:  UseQueryResult<FocusTask[], Error>
	createMutation: UseMutationResult<FocusTask, Error, FormData>
	updateMutation: UseMutationResult<FocusTask, Error, IFocusTaskUpdateArgs>
	deleteMutation: UseMutationResult<FocusTask, Error, IFocusTaskDeleteArgs>
}

export default function useFocusTasksData(userId: string): IFocusTasksData {
	const [activeTask, _setActiveTask] = useState<FocusTask | null>(null)

	const query = useQuery({
		queryFn: async () => getFocusTasks(userId),
		queryKey: [userId]
	})

	function setActiveTask(focusTaskId: string | null) {
		_setActiveTask(prev => {
			// If not id, clear active task
			if (!focusTaskId) return null

			// If prev and new are equal, unset the active task
			if (focusTaskId === prev?.id) return null

			// Set new active task
			return query.data?.find(task => task.id === focusTaskId) ?? null
		})
	}

	const createMutation = useMutation({
		mutationFn: createFocusTask,
		onSuccess: async () => {
			await query.refetch()
		}
	})

	const updateMutation = useMutation({
		mutationFn: updateFocusTask,
		onSuccess: async (data) => {
			await query.refetch()
			if (data.id === activeTask?.id) setActiveTask(data.id)
		}
	})

	const deleteMutation = useMutation({
		mutationFn:  deleteFocusTask
	})

	return {
		activeTask,
		setActiveTask,
		query,
		createMutation,
		updateMutation,
		deleteMutation
	}
}