import {ReactElement, ReactNode} from "react";
import AccountSection from "@/app/_components/TopBarMenus/SettingsDialog/sections/AccountSection";
import ThemeSelectorSection from "@/app/_components/TopBarMenus/SettingsDialog/sections/theme/ThemeSelectorSection";

interface ISettingsMenuSection {
	title: string
	icon: ReactNode
	content: ReactElement
}

const SettingsMenuSections: ISettingsMenuSection[] = [
	AccountSection,
	ThemeSelectorSection,
]

export default SettingsMenuSections

export type {
	ISettingsMenuSection
}
