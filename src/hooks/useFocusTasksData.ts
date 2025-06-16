"use client"

import {UseMutationResult, UseQueryResult} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {useEffect, useState} from "react";
import {IFocusTaskDeleteArgs, IFocusTaskUpdateArgs} from "@/lib/actions/focus-tasks/types";
import useFocusTasksQuery from "@/lib/react-query/queries/useFocusTasksQuery";
import useCreateFocusTaskMutation from "@/lib/react-query/mutations/useCreateFocusTaskMutation";
import useDeleteFocusTaskMutation from "@/lib/react-query/mutations/useDeleteFocusTaskMutation";
import useUpdateFocusTaskMutation from "@/lib/react-query/mutations/useUpdateFocusTaskMutation";

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
	useEffect(() => {
		if (activeTask && query.data) {
			// Find the latest version of the active task from the fresh query data
			const newVersionOfActiveTask = query.data.find(task => task.id === activeTask.id);
			if (newVersionOfActiveTask) {
				// If it exists, update the activeTask state to the fresh version
				_setActiveTask(newVersionOfActiveTask);
			} else {
				// If the task was deleted, clear it
				_setActiveTask(null);
			}
		}
		// Dependency array watches for changes in query.data
	}, [query.data]);

	function setActiveTask(focusTaskId: string | null) {
		if (!focusTaskId) {
			_setActiveTask(null);
			return;
		}
		const taskToActivate = query.data?.find(task => task.id === focusTaskId) ?? null;
		_setActiveTask(taskToActivate);
	}

	const createMutation = useCreateFocusTaskMutation({
		onSuccess: async () => {
			await query.refetch()
		}
	})

	const updateMutation = useUpdateFocusTaskMutation({
		onSuccess: async () => {
			await query.refetch()
		}
	})

	const deleteMutation = useDeleteFocusTaskMutation({
		onSuccess: async () => {
			await query.refetch()
		}
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