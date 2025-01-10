"use client"

import {UseMutationResult, UseQueryResult} from "@tanstack/react-query";
import {deleteFocusTask,} from "@/app/_lib/actions/focusTasks/focusTasksActions";
import {FocusTask} from "@prisma/client";
import {useState} from "react";
import {IFocusTaskDeleteArgs, IFocusTaskUpdateArgs} from "@/app/_lib/actions/focusTasks/types";
import useFocusTasksQuery from "@/app/_lib/react-query/queries/useFocusTasksQuery";
import useCreateFocusTaskMutation from "@/app/_lib/react-query/mutations/useCreateFocusTaskMutation";
import useDeleteFocusTaskMutation from "@/app/_lib/react-query/mutations/useDeleteFocusTaskMutation";
import useUpdateFocusTaskMutation from "@/app/_lib/react-query/mutations/useUpdateFocusTaskMutation";

export interface IFocusTasksData {
	activeTask: FocusTask | null
	setActiveTask: (focusTaskId: string | null) => void
	query: UseQueryResult<FocusTask[], Error>
	createMutation: UseMutationResult<FocusTask, Error, FormData>
	updateMutation: UseMutationResult<FocusTask, Error, IFocusTaskUpdateArgs>
	deleteMutation: UseMutationResult<FocusTask, Error, IFocusTaskDeleteArgs>
}

export default function useFocusTasksData(userId: string): IFocusTasksData {
	const [activeTask, _setActiveTask] = useState<FocusTask | null>(null)

	const query = useFocusTasksQuery(userId)

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

	const createMutation = useCreateFocusTaskMutation({
		onSuccess: async () => {
			await query.refetch()
		}
	})

	const updateMutation = useUpdateFocusTaskMutation({
		onSuccess: async (data) => {
			await query.refetch()
			if (data.id === activeTask?.id) setActiveTask(data.id)
		}
	})

	const deleteMutation = useDeleteFocusTaskMutation({
		mutationFn: deleteFocusTask
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