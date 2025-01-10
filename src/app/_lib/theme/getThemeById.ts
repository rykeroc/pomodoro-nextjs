import globalThemes from "@/app/_lib/theme/globalThemes";
import {ITheme} from "@/app/_lib/theme/ITheme";

function getThemeById(themeId: number | null): ITheme | null {
	const foundTheme = globalThemes.find(theme =>
		theme.id === themeId
	)

	return foundTheme ?? null
}

export default getThemeById