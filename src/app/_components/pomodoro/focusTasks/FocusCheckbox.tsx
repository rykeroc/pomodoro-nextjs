import {FocusTask} from "@prisma/client";
import Checkbox from "@/app/_components/inputs/Checkbox";
import {cn} from "@/app/_lib/utils/cn";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {cx} from "class-variance-authority";

interface IFocusCheckboxProps {
	isActive: boolean,
	focusTask: FocusTask
	onChange: (checked: boolean) => void
	onDelete: () => void
	onSetActiveTask: (focusTask: FocusTask) => void
}

export default function FocusCheckbox({isActive, focusTask, onChange, onDelete, onSetActiveTask}: IFocusCheckboxProps) {
	return (
		<Checkbox className={"w-full"} checked={focusTask.isComplete} onChange={onChange} onDelete={onDelete}>
			<div className={cn("flex", "items-center", "justify-between")}>
				<p>{focusTask.name}</p>

				<div className={cn(
					"flex", "flex-row", "gap-2"
				)}>
					<small className={cn(
						cx({
							"block": isActive ,
							"hidden": !isActive
						}),
						"cursor-pointer",
						"group-hover/root:block"
					)} onClick={() => onSetActiveTask(focusTask)}>
						{isActive ? "Active" : "Set active"}
					</small>

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
	)
}