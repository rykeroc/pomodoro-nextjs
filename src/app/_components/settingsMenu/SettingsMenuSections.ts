import {ReactElement, ReactNode} from "react";
import AccountSection from "@/app/_components/settingsMenu/sections/AccountSection";
import ThemeSelector from "@/app/_components/settingsMenu/sections/theme/ThemeSelector";

interface ISettingsMenuSection {
	title: string
	icon: ReactNode
	content: ReactElement
}

const SettingsMenuSections: ISettingsMenuSection[] = [
	AccountSection,
	ThemeSelector,
]

export default SettingsMenuSections

export type {
	ISettingsMenuSection
}
