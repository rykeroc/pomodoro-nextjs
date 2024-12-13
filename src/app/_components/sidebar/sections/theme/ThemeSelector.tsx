import {ISidebarSection} from "@/app/_components/sidebar/ISidebarSection";
import {PaintBrushIcon} from "@heroicons/react/24/solid";
import {useContext} from "react";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import {ITheme, IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import {cn} from "@/app/_lib/utils/cn";
import ThemeButton from "@/app/_components/sidebar/sections/theme/ThemeButton";

const ThemeSelectorContent = () => {
	const themeContext = useContext<IThemeContext | null>(ThemeContext)

	const handleClick = (theme: ITheme) => themeContext?.setTheme(theme)

	const availableThemes = themeContext?.globalThemes.map((theme, index) =>
		<ThemeButton key={index} theme={theme} onClick={() => handleClick(theme)}/>
	)

	return (
		<div className={cn(
			'grid', 'flex-wrap', 'gap-4',
			'grid-cols-1', 'lg:grid-cols-2', '2xl:grid-cols-3'
			)}>
			{availableThemes}
		</div>
	)
}

const ThemeSelector: ISidebarSection = {
	title: "Theme",
	icon: <PaintBrushIcon className={'size-5'}/>,
	content: <ThemeSelectorContent/>
}

export default ThemeSelector