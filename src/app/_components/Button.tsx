import {Button as HeadlessUiButton} from "@headlessui/react";
import {ButtonHTMLAttributes, useContext,} from "react";
import {fadeTransitionClasses, glassEffectClasses} from "@/app/_components/common";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/app/_lib/utils/cn";
import {IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";

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


const Button = ({className, variant = "none", ...props}: ButtonProps) => {
	const theme = useContext<IThemeContext | null>(ThemeContext)
	// Apply color theme to button if primary variant
	const themeClasses: string[] | null = variant === "primary" && theme?.selectedTheme ?
		[theme.selectedTheme.colorClasses.background, theme.selectedTheme.colorClasses.border] : null

	return <HeadlessUiButton
		className={cn(
			buttonClasses({variant,}),
			className,
			themeClasses
		)}
		{...props}
	/>
}

export default Button

export type {
	ButtonProps,
}
