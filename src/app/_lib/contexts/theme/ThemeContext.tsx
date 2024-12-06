import {createContext, ReactNode, useEffect, useMemo, useState} from "react";
import {ITheme, IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";
import LocalUserPreferences from "@/app/_lib/data/UserPreferences/LocalUserPreferences";

const ThemeContext = createContext<IThemeContext | null>(null)

const ThemeProvider = (
	{children}: { children: ReactNode }
) => {
	const userPreferences = useMemo(() => new LocalUserPreferences(), [])

	const savedTheme = useMemo(() => {
		// Get preference string if exists, or 0 for first global theme index
		const savedThemePreference = (userPreferences.getPreference(LocalUserPreferences.theme) ?? 0).toString()
		const savedThemeIndex = parseInt(savedThemePreference, 10);
		return globalThemes[savedThemeIndex]
	}, [])

	const [selectedTheme, _setSelectedTheme] = useState(savedTheme);

	// Save index of selected theme
	const setSelectedTheme = (theme: ITheme) => {
		userPreferences.savePreference(
			LocalUserPreferences.theme,
			globalThemes.indexOf(theme).toString()
		)
		_setSelectedTheme(theme)
	}

	return (
		<ThemeContext.Provider value={{
			globalThemes,
			selectedTheme,
			setSelectedTheme
		}}>
			{children}
		</ThemeContext.Provider>
	)
}

export default ThemeContext

export {
	ThemeProvider
}