import {FocusTask} from "@prisma/client";
import Checkbox from "@/app/_components/inputs/Checkbox";
import {cn} from "@/app/_lib/utils/cn";

interface IFocusCheckboxProps {
	isActive: boolean,
	focusTask: FocusTask
	onChange: (checked: boolean) => void
}

export default function FocusCheckbox({isActive, focusTask, onChange}: IFocusCheckboxProps) {
	return (
		<Checkbox className={"w-full"} checked={focusTask.isComplete} onChange={onChange}>
			<div className={cn("flex", "items-center", "justify-between")}>
				<p>{focusTask.name}</p>
				{isActive &&
					<small className={"text-secondary-text"}>Active</small>
				}
			</div>
		</Checkbox>
	)
}