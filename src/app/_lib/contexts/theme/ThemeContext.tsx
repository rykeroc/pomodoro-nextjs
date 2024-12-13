import {createContext, ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {ITheme, IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";
import {UserPreference} from "@prisma/client";
import {upsertUserPreferences} from "@/app/_lib/actions/data/UserPreference";
import {useSession} from "next-auth/react";

const ThemeContext = createContext<IThemeContext | null>(null)

interface ThemeProviderProps {
	children: ReactNode
	initialUserPreference: UserPreference | null
}

const ThemeProvider = (
	{children, initialUserPreference}: ThemeProviderProps
) => {
	const {data: session} = useSession()
	const [error, setError] = useState<string | null>(null)
	const [theme, _setTheme] = useState(globalThemes.find(t => t.id == initialUserPreference?.themeId) ?? globalThemes[0]);

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