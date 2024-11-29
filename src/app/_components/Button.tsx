import {Button as HeadlessUiButton} from "@headlessui/react";
import {ReactNode} from "react";
import clsx from "clsx";

type ButtonColor = "primary" | "secondary" | "glass" | "none"

interface ButtonProps {
	children?: ReactNode
	color?: ButtonColor
}

const classes = {
	default: "w-fit h-fit rounded-full text-lg font-semibold hover:brightness-110",
	primary: "py-3 px-6 bg-primary border-primary",
	secondary: "py-3 px-6 bg-secondary-text border-secondary-text",
	glass: "py-3 px-6 border border-primary-container bg-gradient-to-br from-primary-container hover:brightness-125",
	none: "bg-transparent hover:brightness-125"
}

const Button = ({children, color = "primary"}: ButtonProps) => (
	<HeadlessUiButton className={clsx(classes.default, classes[color])}>
		{children}
	</HeadlessUiButton>
)

export default Button