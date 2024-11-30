import {ReactNode} from "react";
import {Checkbox as HeadlessUiCheckbox} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/16/solid";
import {fadeTransitionClasses} from "@/app/_components/common";
import {cx} from "class-variance-authority";

interface CheckboxProps {
	children?: ReactNode
	checked?: boolean
	onChange?: (checked: boolean) => void
}

const Checkbox = ({children, checked, onChange}: CheckboxProps) => (
	<div className={cx([
		'flex flex-row gap-3 items-center',
		"hover:brightness-125",
		...fadeTransitionClasses
	])}>
		<HeadlessUiCheckbox
			checked={checked} onChange={onChange}
			className={cx([
				"group peer size-6", "rounded-md", "bg-transparent", "p-1",
				"ring-1", "ring-primary-text", "ring-inset",
				"data-[checked]:bg-primary", "data-[checked]:ring-primary",
			])}>
			<CheckIcon className={cx([
				"hidden", "bg-primary", "size-4", "fill-primary-text",
				"group-data-[checked]:block"
			])}/>
		</HeadlessUiCheckbox>

		<label className={cx("peer-data-[checked]:text-secondary-text")}>{children}</label>
	</div>
)

export default Checkbox
