import {Button as HeadlessUiButton} from "@headlessui/react";
import {ButtonHTMLAttributes,} from "react";
import {fadeTransitionClasses, glassEffectClasses} from "@/app/_components/common";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/app/_lib/cn";

const buttonClasses = cva(
	[
		"w-fit", "h-fit", "rounded-full", "text-lg", "font-semibold",
		"flex", "flex-row", "items-center", "gap-1",
		'cursor-pointer',
		"hover:brightness-110",
		...fadeTransitionClasses
	],
	{
		variants: {
			variant: {
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
					...glassEffectClasses
				],
				none: [
					"bg-transparent", "hover:brightness-125"
				]
			}
		}
	}
)

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonClasses> {
}


const Button = ({className, variant = "none", ...props}: ButtonProps) =>
	<HeadlessUiButton
		className={cn(
			buttonClasses({variant,}),
			className
		)}
		{...props}
	/>

export default Button
