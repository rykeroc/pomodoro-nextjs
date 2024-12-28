import {cn} from "@/app/_lib/utils/cn";

interface IErrorMessageProps {
	children: string
}

export default function ErrorMessage({children}: IErrorMessageProps){
	return (
		<div className={cn(
			"p-2", "bg-red-700/70", "rounded-xl",
		)}>
			<p>
				{children}
			</p>
		</div>
	)
}