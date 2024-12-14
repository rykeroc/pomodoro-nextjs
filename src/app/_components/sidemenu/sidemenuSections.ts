import {ISidemenuSection} from "@/app/_components/sidemenu/ISidemenuSection";
import ThemeSelector from "@/app/_components/sidemenu/sections/theme/ThemeSelector";
import AccountSection from "@/app/_components/sidemenu/sections/AccountSection";

const sidemenuSections: ISidemenuSection[] = [
	AccountSection,
	ThemeSelector,
]

export default sidemenuSections