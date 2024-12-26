import {ReactNode} from "react";
import {cn} from "@/app/_lib/utils/cn";

export default function SignInLayout({children,}: Readonly<{ children: ReactNode; }>) {
	return (
		<div className={cn("p-3")}>

			<h4>Focus Cafe</h4>
			<div className={cn(
				"h-screen", "flex", "flex-col", "justify-center", "items-center",
			)}>
				{children}
			</div>

		</div>
	)
}