import {createContext, ProviderProps, ReactNode, useState} from "react";
import {IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";

const ThemeContext = createContext<IThemeContext | null>(null)

const ThemeProvider = (
	{children}: { children: ReactNode }
) => {
	// TODO: Save index of selected theme somewhere
	const [selectedTheme, setSelectedTheme] = useState(globalThemes[0])

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