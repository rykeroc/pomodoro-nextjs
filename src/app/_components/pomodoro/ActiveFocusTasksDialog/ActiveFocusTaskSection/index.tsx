import {FocusTask} from "@prisma/client";
import {cn} from "@/app/_lib/utils/cn";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import React from "react";
import {secondsToMinutes} from "@/app/_lib/utils/dateTimeUtils";
import {cx} from "class-variance-authority";

interface IFocusTaskSectionProps {
	title: string
	focusTasks: FocusTask[]
	activeTask?: FocusTask | null
	focusTasksData: IFocusTasksData
}

export default function ActiveFocusTasksSection(
	{
		title,
		focusTasks,
		activeTask,
		focusTasksData
	}: IFocusTaskSectionProps
) {

	function handleSetActiveTask(focusTaskId: string) {
		focusTasksData.setActiveTask(focusTaskId)
	}

	const items = focusTasks.map(task => {
		return (
			<FocusItem
				key={task.id}
				focusTask={task}
				isActive={task.id === activeTask?.id}
				onSetActiveTask={handleSetActiveTask}
			/>
		)
	})

	return (
		<div className={cn(
			"flex", "flex-col", "items-start", "gap-3",
			"w-full"
		)}>
			<h5 className={"text-primary-text"}>
				{title}
			</h5>
			<div className={cn(
				"flex", "flex-col", "gap-2",
				"w-full"
			)}>
				{items}
			</div>
		</div>
	)
}

interface IFocusItemProps {
	focusTask: FocusTask
	isActive: boolean
	onSetActiveTask: (focusTaskId: string) => void
}

function FocusItem(
	{focusTask, isActive, onSetActiveTask}: IFocusItemProps
) {
	const handleClick = focusTask.isComplete ? undefined : () => {
		onSetActiveTask(focusTask.id)
	}

	const focusMinutes = focusTask.totalFocusSeconds >= 60 ? secondsToMinutes(focusTask.totalFocusSeconds, false) : null

	return (
		<div onClick={handleClick} className={cn(
			"flex", "flex-row", "items-center", "justify-between", "ps-2",
			"text-secondary-text",
			"hover:text-primary-text",
			cx({
				"text-primary-text": isActive,
				"cursor-pointer": !focusTask.isComplete,
				["cursor-not-allowed hover:text-secondary-text"]: focusTask.isComplete,
			})
		)}>
			<p className={cn(
				"flex", "flex-grow", "border-none", "line-clamp-1",
				cx({
					"line-through": focusTask.isComplete,
				})
			)}>
				{focusTask.name}
			</p>

			{
				focusMinutes &&
                <small className={cn(
					"flex", "flex-shrink", "w-fit"
				)}>{focusMinutes} min</small>
			}
		</div>
	)
}