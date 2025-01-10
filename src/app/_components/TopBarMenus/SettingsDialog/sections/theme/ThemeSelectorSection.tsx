import {PaintBrushIcon} from "@heroicons/react/24/solid";
import {ISettingsMenuSection} from "@/app/_components/TopBarMenus/SettingsDialog/SettingsMenuSections";
import ThemeTypeSection from "@/app/_components/TopBarMenus/SettingsDialog/sections/theme/ThemeTypeSection";
import {EBackgroundType, ITheme} from "@/app/_lib/theme/ITheme";
import {
	useUserPreferences
} from "@/app/_lib/theme/IUserPreferencesContext";
import globalThemes from "@/app/_lib/theme/globalThemes";

type TypeThemes = { [type in EBackgroundType]: ITheme[] }

function ThemeSelectorContent() {
	const {theme} = useUserPreferences()

	const availableThemesByType = (globalThemes ?? []).reduce((acc, curr) => {
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
			activeTheme={theme}
		/>
	))
}

const ThemeSelectorSection: ISettingsMenuSection = {
	title: "Theme",
	icon: <PaintBrushIcon className={'size-5'}/>,
	content: <ThemeSelectorContent/>
}

export default ThemeSelectorSection