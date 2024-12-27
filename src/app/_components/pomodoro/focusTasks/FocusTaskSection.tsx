import {FocusTask} from "@prisma/client";
import {cn} from "@/app/_lib/utils/cn";
import FocusCheckbox from "@/app/_components/pomodoro/focusTasks/FocusCheckbox";

interface IFocusTaskSectionProps {
	title: string
	focusTasks: FocusTask[]
	activeTask?: FocusTask | null
}

export default function FocusTaskSection({title, focusTasks, activeTask}: IFocusTaskSectionProps) {
	const checkboxes = focusTasks.map(t => <FocusCheckbox key={t.id} focusTask={t} isActive={t.id === activeTask?.id}/>)
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