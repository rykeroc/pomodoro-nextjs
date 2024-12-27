import {FocusTask} from "@prisma/client";
import {cn} from "@/app/_lib/utils/cn";
import FocusCheckbox from "@/app/_components/pomodoro/focusTasks/FocusCheckbox";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import Form from "next/form";
import {UpsertFocusTaskType} from "@/app/_lib/actions/data/focusTasks/types";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";

interface IFocusTaskSectionProps {
	title: string
	focusTasks: FocusTask[]
	activeTask?: FocusTask | null
	focusTasksData: IFocusTasksData
}

export default function FocusTaskSection({title, focusTasks, activeTask, focusTasksData}: IFocusTaskSectionProps) {
	async function handleCheckChange(checked: boolean, focusTask: FocusTask) {
		const newTask: UpsertFocusTaskType = {
			...focusTask,
			isComplete: checked,
		}
		await focusTasksData.dataMutation.mutateAsync(newTask)
		await focusTasksData.dataQuery.refetch()
	}

	const checkboxes = focusTasks.map(task => {
		return (
			<FocusCheckbox
				key={task.id} focusTask={task} isActive={task.id === activeTask?.id}
				onChange={(checked) => handleCheckChange(checked, task)}
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

				{
					checkboxes.length === 0 &&
                    <p>There are currently no uncompleted focus tasks</p>
				}
			</div>
		</div>
	)
}