"use client"

import {FocusTask} from "@prisma/client";
import {cn} from "@/app/_lib/utils/cn";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import React, {useRef} from "react";
import Checkbox from "@/app/_components/inputs/Checkbox";
import Form from "next/form";
import {XMarkIcon} from "@heroicons/react/24/solid";
import ErrorMessage from "@/app/_components/ErrorMessage";
import {Input} from "@headlessui/react";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {IFocusTaskDeleteArgs, IFocusTaskUpdateArgs} from "@/app/_lib/actions/focusTasks/types";

interface IFocusTaskSectionProps {
	title: string
	focusTasks: FocusTask[]
	focusTasksData: IFocusTasksData
}

export default function FocusTasksDialogSection({title, focusTasks, focusTasksData}: IFocusTaskSectionProps) {
	const {data: session} = useSession({
		required: true,
		onUnauthenticated() {
			redirect("/sign-in")
		}
	})

	if (!session?.user?.id) {
		return null;
	}

	const userId = session.user.id;

	async function handleCheckChange(checked: boolean, focusTask: FocusTask) {
		const formData = Object.entries({...focusTask, isComplete: checked}).reduce((previousValue, [key, value]) => {
			previousValue.append(key, value as string)
			return previousValue
		}, new FormData())

		const updateArgs: IFocusTaskUpdateArgs = {formData, userId}

		await focusTasksData.updateMutation.mutateAsync(updateArgs)
		if (checked) focusTasksData.setActiveTask(null)
		await focusTasksData.query.refetch()
	}

	async function handleDelete(focusTask: FocusTask) {
		const deleteArgs: IFocusTaskDeleteArgs = {
			focusTaskId: focusTask.id,
			userId
		}
		await focusTasksData.deleteMutation.mutateAsync(deleteArgs)
		focusTasksData.setActiveTask(null)
		await focusTasksData.query.refetch()
	}

	const checkboxes = focusTasks.map(task => {
		return (
			<FocusItem
				key={task.id}
				userId={userId}
				focusTask={task}
				onChange={(checked) => handleCheckChange(checked, task)}
				onDelete={() => handleDelete(task)}
				focusTasksData={focusTasksData}
			/>
		)
	})

	return (
		<div className={cn(
			"flex", "flex-col", "items-start", "gap-3",
			"w-full"
		)}>
			<h5 className={"text-secondary-text"}>
				{title}
			</h5>
			<div className={cn(
				"flex", "flex-col", "gap-2",
				"w-full"
			)}>
				{checkboxes}
			</div>
		</div>
	)
}

interface IFocusItemProps {
	userId: string
	focusTask: FocusTask
	onChange: (checked: boolean) => void
	onDelete: () => void
	focusTasksData: IFocusTasksData
}

function FocusItem(
	{userId, focusTask, onChange, onDelete, focusTasksData}: IFocusItemProps
) {
	const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input
	function blurInput() {
		// Remove focus from the input
		if (inputRef.current)
			inputRef.current.blur();
	}

	const {
		mutateAsync,
		isError,
		error
	} = focusTasksData.updateMutation

	async function handleUpdate(formData: FormData) {
		const updateArgs: IFocusTaskUpdateArgs = {
			formData,
			userId
		}

		try {
			await mutateAsync(updateArgs)
		} catch (e) {
			console.log(e)
		} finally {
			blurInput()
		}
	}

	// Reset name value when blurred
	function handleBlur(e: React.FocusEvent<HTMLInputElement>): void {
		if (e.currentTarget.value !== focusTask.name)
			e.currentTarget.value = focusTask.name
	}

	return (
		<div className={cn(
			"flex", "flex-col", "gap-2", "ps-2"
		)}>
			<Checkbox
				className={"w-full"}
				checked={focusTask.isComplete}
				onChange={onChange}>
				<div className={cn("flex", "items-center", "justify-between")}>
					<Form action={handleUpdate}>
						<Input name={"id"} value={focusTask.id} hidden readOnly/>
						<Input
							ref={inputRef}
							name={"name"} defaultValue={focusTask.name}
							className={cn(
								"border-none", "w-full", "line-clamp-1", "bg-transparent",
								"focus:outline-none", "focus:text-primary-text"
							)}
							disabled={focusTask.isComplete}
							type={"text"}
							onBlur={handleBlur}
							required
						/>
						<Input type={"submit"} hidden/>
					</Form>

					<div className={cn(
						"flex", "flex-row", "items-center", "gap-2"
					)}>
						<div className={cn(
							"invisible", "group-hover/root:visible",
						)}>
							<XMarkIcon
								onClick={onDelete}
								className={cn(
									"size-6",
									"fill-secondary-text",
									"cursor-pointer",
									"hover:fill-red-800"
								)}/>
						</div>
					</div>
				</div>
			</Checkbox>
			{
				isError &&
                <ErrorMessage>{error.message}</ErrorMessage>
			}
		</div>
	)
}