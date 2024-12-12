import {ISidebarSection} from "@/app/_components/sidebar/ISidebarSection";
import ThemeSelector from "@/app/_components/sidebar/sections/theme/ThemeSelector";
import AccountSection from "@/app/_components/sidebar/sections/AccountSection";

const sidebarSections: ISidebarSection[] = [
	AccountSection,
	ThemeSelector,
]

export default sidebarSections