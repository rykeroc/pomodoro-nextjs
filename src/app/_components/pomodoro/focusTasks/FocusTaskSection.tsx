import {FocusTask} from "@prisma/client";
import {cn} from "@/app/_lib/utils/cn";
import FocusCheckbox from "@/app/_components/pomodoro/focusTasks/FocusCheckbox";
import {UpsertFocusTaskType} from "@/app/_lib/actions/focusTasks/types";
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
		await focusTasksData.upsertMutation.mutateAsync(newTask)
		if (checked) focusTasksData.setActiveTask(null)
		await focusTasksData.query.refetch()
	}

	async function handleDelete(focusTask: FocusTask) {
		await focusTasksData.deleteMutation.mutateAsync(focusTask.id)
		focusTasksData.setActiveTask(null)
		await focusTasksData.query.refetch()
	}

	function handleSetActiveTask(focusTask: FocusTask){
		/*
		Set active task if current task is not the current active task,
		Else clear the active task.
		 */
		focusTasksData.setActiveTask(activeTask?.id !== focusTask.id ? focusTask : null)
	}

	const checkboxes = focusTasks.map(task => {
		return (
			<FocusCheckbox
				key={task.id} focusTask={task} isActive={task.id === activeTask?.id}
				onChange={(checked) => handleCheckChange(checked, task)}
				onDelete={() => handleDelete(task)}
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
				{checkboxes}

				{
					checkboxes.length === 0 &&
                    <p>There are currently no uncompleted focus tasks</p>
				}
			</div>
		</div>
	)
}