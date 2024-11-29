import {ReactNode} from "react";
import {Checkbox as HeadlessUiCheckbox} from "@headlessui/react";
import clsx from "clsx";
import {CheckIcon} from "@heroicons/react/16/solid";

interface CheckboxProps {
	children?: ReactNode
	checked?: boolean
	onChange?: (checked: boolean) => void
}

const Checkbox = ({children, checked, onChange}: CheckboxProps) => (
	<div className={clsx(
		'flex flex-row gap-3 items-center'
	)}>
		<HeadlessUiCheckbox
			checked={checked} onChange={onChange}
			className={clsx(
				"group size-6 rounded-md bg-transparent p-1 ring-1 ring-primary-text ring-inset",
				"data-[checked]:bg-primary data-[checked]:ring-primary",
			)}
		>
			<CheckIcon className={clsx("hidden bg-primary size-4 fill-primary-text",
				"group-data-[checked]:block")}/>
		</HeadlessUiCheckbox>
		<label className={clsx({
			"text-secondary-text": checked === true
		})}>{children}</label>
	</div>
)

export default Checkbox
