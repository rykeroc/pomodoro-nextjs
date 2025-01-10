import {ReactElement, ReactNode} from "react";
import AccountSection from "@/components/feature/auth/AccountSection";
import ThemeSelectorSection from "@/components/feature/theme/ThemeSelectorSection";

interface ISettingsMenuSection {
	title: string
	icon: ReactNode
	content: ReactElement
}

const settingsMenuSections: ISettingsMenuSection[] = [
	AccountSection,
	ThemeSelectorSection,
]

export default settingsMenuSections

export type {
	ISettingsMenuSection
}
