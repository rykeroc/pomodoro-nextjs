import {FocusTask} from "@prisma/client";
import Checkbox from "@/app/_components/inputs/Checkbox";
import {cn} from "@/app/_lib/utils/cn";
import {XMarkIcon} from "@heroicons/react/24/solid";

interface IFocusCheckboxProps {
	isActive: boolean,
	focusTask: FocusTask
	onChange: (checked: boolean) => void
	onDelete: () => void
}

export default function FocusCheckbox({isActive, focusTask, onChange, onDelete}: IFocusCheckboxProps) {
	return (
		<Checkbox className={"w-full"} checked={focusTask.isComplete} onChange={onChange} onDelete={onDelete}>
			<div className={cn("flex", "items-center", "justify-between")}>
				<p>{focusTask.name}</p>

				{isActive &&
                    <small className={"text-secondary-text"}>Active</small>
				}

				<div className={cn(
					"invisible", "group-hover/root:visible",
				)}>
					<XMarkIcon
						onClick={onDelete}
						className={cn(
							"size-6",
							"fill-secondary-text",
							"hover:fill-red-800"
						)}/>
				</div>
			</div>
		</Checkbox>
	)
}