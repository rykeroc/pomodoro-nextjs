import {Button as HeadlessUiButton} from "@headlessui/react";
import {ButtonHTMLAttributes, } from "react";
import {fadeTransitionClasses} from "@/app/_components/common";
import {cva, VariantProps} from "class-variance-authority";

const buttonClasses = cva(
	["w-fit", "h-fit", "rounded-full", "text-lg", "font-semibold", "hover:brightness-110", ...fadeTransitionClasses],
	{
		variants: {
			intent: {
				primary: [
					"py-3", "px-6",
					"bg-primary", "border-primary"
				],
				secondary: [
					"py-3", "px-6",
					"bg-secondary-text", "border-secondary-text"
				],
				glass: [
					"py-3", "px-6",
					"border", "border-primary-container", "bg-gradient-to-br", "from-primary-container",
					"hover:brightness-125"
				],
				"none": [
					"bg-transparent", "hover:brightness-125"
				]
			}
		}
	}
)

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonClasses> {}


const Button = ({className, intent, ...props}: ButtonProps) =>
	<HeadlessUiButton
		className={buttonClasses({className, intent})}
		{...props}
	/>

export default Button
