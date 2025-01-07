import {PaintBrushIcon} from "@heroicons/react/24/solid";
import {useContext} from "react";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import {EBackgroundType, ITheme, IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import {cn} from "@/app/_lib/utils/cn";
import ThemeButton from "@/app/_components/TopBarMenus/SettingsDialog/sections/theme/ThemeButton";
import {ISettingsMenuSection} from "@/app/_components/TopBarMenus/SettingsDialog/SettingsMenuSections";
import ThemeTypeSection from "@/app/_components/TopBarMenus/SettingsDialog/sections/theme/ThemeTypeSection";

type TypeThemes = { [type in EBackgroundType]: ITheme[] }

function ThemeSelectorContent() {
	const themeContext = useContext<IThemeContext | null>(ThemeContext)
	const activeTheme: ITheme | undefined = themeContext?.theme

	const availableThemesByType = (themeContext?.globalThemes ?? []).reduce((acc, curr) => {
		if (!acc[curr.backgroundType])
			acc[curr.backgroundType] = []
		acc[curr.backgroundType].push(curr)
		return acc
	}, {} as TypeThemes)

	return Object.entries(availableThemesByType).map(([key, value]) => (
		<ThemeTypeSection
			key={key}
			type={EBackgroundType[key as keyof typeof EBackgroundType]}
			themes={value}
			activeTheme={activeTheme}
		/>
	))
}

const ThemeSelectorSection: ISettingsMenuSection = {
	title: "Theme",
	icon: <PaintBrushIcon className={'size-5'}/>,
	content: <ThemeSelectorContent/>
}

export default ThemeSelectorSection