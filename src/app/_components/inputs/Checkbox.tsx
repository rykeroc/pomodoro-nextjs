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
				"ring-1", "ring-primary-text", "ring-inset",
				`data-[checked]:ring-secondary-text`, `data-[checked]:bg-secondary-text`
			)}>
			<CheckIcon className={cn(
				"hidden", "bg-secondary-text", "size-4", "fill-black",
				"group-data-[checked]:block"
			)}/>
		</HeadlessUiCheckbox>

		<div className={cn("peer-data-[checked]:text-secondary-text", "w-full")}>{children}</div>
	</div>
)

export default Checkbox
