import {FocusTask} from "@prisma/client";
import Checkbox from "@/app/_components/inputs/Checkbox";
import {cn} from "@/app/_lib/utils/cn";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {cx} from "class-variance-authority";
import {Input} from "@headlessui/react";
import Form from "next/form";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import {useRef} from "react";

interface IFocusCheckboxProps {
	isActive: boolean,
	focusTask: FocusTask
	onChange: (checked: boolean) => void
	onDelete: () => void
	onSetActiveTask: (focusTask: FocusTask) => void
	focusTasksData: IFocusTasksData
}

export default function FocusItem({isActive, focusTask, onChange, onDelete, onSetActiveTask, focusTasksData}: IFocusCheckboxProps) {
	const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input

	async function handleItemUpdate(formData: FormData) {
		const taskName = formData.get("focusTaskName") as string

		if (!taskName) return

		focusTask.name = taskName
		await focusTasksData.upsertMutation.mutateAsync(focusTask)
		await focusTasksData.query.refetch()

		// Remove focus from the input
		if (inputRef.current) {
			inputRef.current.blur();
		}
	}

	return (
		<Checkbox className={"w-full"} checked={focusTask.isComplete} onChange={onChange} onDelete={onDelete}>
			<div className={cn("flex", "items-center", "justify-between")}>
				<Form action={handleItemUpdate}>
					<Input
						ref={inputRef}
						name={"focusTaskName"} defaultValue={focusTask.name}
						className={cn(
							"border-none", "w-full", "line-clamp-1", "bg-transparent",
							"focus:outline-none", "focus:text-primary-text"
						)}
						disabled={focusTask.isComplete}
						type={"text"}
						required
					/>
				</Form>

				<div className={cn(
					"flex", "flex-row", "gap-2"
				)}>
					<small className={cn(
						cx({
							"block": isActive ,			// Show by default if active
							"hidden": !isActive,		// Hide by default if not active
							"group-hover/root:block": !isActive && !focusTask.isComplete	// Show when hovered, if task is not active and not completed
						}),
						"cursor-pointer",
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