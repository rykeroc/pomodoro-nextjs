import {PaintBrushIcon} from "@heroicons/react/24/solid";
import {ISettingsMenuSection} from "@/components/feature/settings/settingsMenuSections";
import ThemeTypeSection from "@/components/feature/theme/ThemeTypeSection";
import {EBackgroundType, ITheme} from "@/lib/theme/types";

import globalThemes from "@/lib/theme/globalThemes";
import useUserPreferences from "@/hooks/useUserPreferences";

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