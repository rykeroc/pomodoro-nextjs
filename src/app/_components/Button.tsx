import {Button as HeadlessUiButton} from "@headlessui/react";
import {ButtonHTMLAttributes, } from "react";
import {fadeTransitionClasses, glassEffectClasses} from "@/app/_components/common";
import {cva, VariantProps} from "class-variance-authority";

const buttonClasses = cva(
	[
		"w-fit", "h-fit", "rounded-full", "text-lg", "font-semibold",
		"flex", "flex-row", "items-center", "gap-1",
		"hover:brightness-110",
		...fadeTransitionClasses
	],
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
					"hover:brightness-125", ...glassEffectClasses
				],
				none: [
					"bg-transparent", "hover:brightness-125"
				]
			}
		}
	}
)

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonClasses> {}


const Button = ({className, intent = "none", ...props}: ButtonProps) =>
	<HeadlessUiButton
		className={buttonClasses({className, intent})}
		{...props}
	/>

export default Button
