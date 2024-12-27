import {ReactNode, useContext} from "react";
import {Checkbox as HeadlessUiCheckbox} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/16/solid";
import {fadeTransitionClasses} from "@/app/_components/common";
import {cn} from "@/app/_lib/utils/cn";
import {IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";

interface CheckboxProps {
	children?: ReactNode
	checked?: boolean
	onChange?: (checked: boolean) => void,
	className?: string
}

const Checkbox = ({children, checked, onChange, className}: CheckboxProps) => (
	<div className={cn(
		'flex flex-row gap-3 items-center',
		"hover:brightness-125",
		...fadeTransitionClasses,
		className
	)}>
		<HeadlessUiCheckbox
			checked={checked} onChange={onChange}
			className={cn(
				"group", "peer", "size-6", "rounded-md", "bg-transparent", "p-1",
				"ring-1", "ring-secondary-text", "ring-inset",
				`data-[checked]:bg-secondary-text`
			)}>
			<CheckIcon className={cn(
				"hidden", "bg-secondary-text", "size-4", "fill-black",
				"group-data-[checked]:block"
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
