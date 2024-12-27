import {ReactNode} from "react";
import {Checkbox as HeadlessUiCheckbox} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/16/solid";
import {fadeTransitionClasses} from "@/app/_components/common";
import {cn} from "@/app/_lib/utils/cn";
import {XMarkIcon} from "@heroicons/react/24/solid";

interface CheckboxProps {
	children?: ReactNode
	checked?: boolean
	onChange?: (checked: boolean) => void,
	onDelete?: () => void
	className?: string
}

const Checkbox = ({children, checked, onChange, onDelete, className}: CheckboxProps) => (
	<div className={cn(
		'flex flex-row gap-3 items-center',
		"hover:brightness-125",
		"group/root",
		...fadeTransitionClasses,
		className
	)}>
		<HeadlessUiCheckbox
			checked={checked} onChange={onChange}
			className={cn(
				"cursor-pointer",
				"group/checkbox", "peer", "size-6", "rounded-md", "bg-transparent", "p-1",
				"ring-1", "ring-secondary-text", "ring-inset",
				`data-[checked]:bg-secondary-text`
			)}>
			<CheckIcon className={cn(
				"invisible", "bg-secondary-text", "size-4", "fill-black",
				"group-data-[checked]/checkbox:visible"
			)}/>
		</HeadlessUiCheckbox>

		<div className={cn(
			"line-clamp-1", "overflow-ellipsis",
			"text-secondary-text",
			"peer-data-[checked]:line-through",
			"w-full",
		)}>{children}</div>
	</div>
)

export default Checkbox
