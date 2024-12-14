"use client"

import {createContext, ReactNode, useState} from "react";
import {ITheme, IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import {upsertUserPreferences} from "@/app/_lib/actions/data/UserPreference";
import {useSession} from "next-auth/react";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";

const ThemeContext = createContext<IThemeContext | null>(null)

interface ThemeProviderProps {
	children: ReactNode
	initialData: ITheme
}

const ThemeProvider = (
	{children, initialData}: ThemeProviderProps
) => {
	const {data: session} = useSession()
	const [error, setError] = useState<string | null>(null)
	const [theme, _setTheme] = useState(initialData);

	// Save id of selected theme
	const setTheme = async (theme: ITheme) => {
		// Set theme for user
		_setTheme(theme)

		if (!session || !session?.user || !session?.user?.id)
			return

		// Set theme in user preferences for signed-in user
		try{
			await upsertUserPreferences({
				userId: session.user.id,
				themeId: theme.id
			})
		} catch (e) {
			console.log(e)
			setError("An error occurred while saving theme preferences.")
		}
	}

	return (
		<ThemeContext.Provider value={{
			theme,
			setTheme,
			error,
			globalThemes,
		}}>
			{children}
		</ThemeContext.Provider>
	)
}

export default ThemeContext

export {
	ThemeProvider
}