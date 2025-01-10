"use client"

import {Button as HeadlessUiButton} from "@headlessui/react";
import {ButtonHTMLAttributes, } from "react";
import {fadeTransitionClasses, glassEffectClasses} from "@/components/common";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/lib/cn";
import useUserPreferences from "@/hooks/useUserPreferences";

const buttonClasses = cva(
	[
		...fadeTransitionClasses,
		"w-fit", "h-fit", "rounded-full", "text-lg", "font-semibold",
		"flex", "flex-row", "items-center", "justify-center", "gap-2",
		'cursor-pointer',
		"hover:brightness-110",
		"disabled:brightness-100", "disabled:cursor-default"
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
					...glassEffectClasses,
					"py-3", "px-6",
				],
				none: [
				 	"text-secondary-text", "bg-transparent", "hover:brightness-125"
				]
			},
			active: {
				true: ["brightness-125"],
				false: []
			}
		}
	}
)

interface IButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonClasses> {
}

const Button = ({className, variant = "none", active = false, ...props}: IButtonProps) => {
	const {theme} = useUserPreferences()
	// Apply color theme to button if primary variant
	const themeClasses: string[] | null = variant === "primary" ?
		[theme.colorClasses.background, theme.colorClasses.border] : null

	return <HeadlessUiButton
		className={cn(
			buttonClasses({variant, active}),
			className,
			themeClasses
		)}
		{...props}
	/>
}

export default Button

export type {
	IButtonProps,
}
