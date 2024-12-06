import {ReactElement, ReactNode} from "react";

interface ISidebarSection {
	title: string
	icon: ReactNode
	content: ReactElement
}

export type {
	ISidebarSection
}