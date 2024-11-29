import {Button as HeadlessUiButton} from "@headlessui/react";
import {ReactNode} from "react";
import clsx from "clsx";

type ButtonColor = "primary" | "secondary" | "glass" | "none"

interface ButtonProps {
	children: ReactNode
	color?: ButtonColor
}

const classes = {
	default: "w-fit h-fit py-3 px-6 rounded-full text-lg font-semibold",
	primary: "bg-primary border-primary",
	secondary: "bg-secondary-text border-secondary-text",
	glass: "border border-primary-container bg-gradient-to-br from-primary-container",
	none: "bg-transparent py-0 px-0"
}

const Button = ({children, color = "primary"}: ButtonProps) => (
	<HeadlessUiButton className={clsx(
		classes.default, classes[color]
	)}>
		{children}
	</HeadlessUiButton>
)

export default Button