import globalThemes from "@/lib/theme/globalThemes";
import {ITheme} from "@/lib/theme/types";

function getThemeById(themeId: number | null): ITheme | null {
	const foundTheme = globalThemes.find(theme =>
		theme.id === themeId
	)

	return foundTheme ?? null
}

export default getThemeById