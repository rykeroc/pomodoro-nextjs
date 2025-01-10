import ThemeButton from "@/components/feature/theme/ThemeButton";
import {cn} from "@/lib/cn";
import {EBackgroundType, ITheme} from "@/lib/theme/types";
import useUserPreferences from "@/hooks/useUserPreferences";

interface IThemeTypeSectionProps {
	type: EBackgroundType
	themes: ITheme[]
	activeTheme?: ITheme
}

export default function ThemeTypeSection({type, themes, activeTheme}: IThemeTypeSectionProps) {
	const {setTheme} = useUserPreferences()

	function handleClick(theme: ITheme) {
		if (activeTheme?.id === theme.id) return
		setTheme(theme)
	}

	const themeButtons = themes.map((theme, index) => {
		// Check if the theme is the current active theme
		const isActive = activeTheme?.id === theme.id

		return <ThemeButton
			key={index}
			theme={theme}
			onClick={() => handleClick(theme)}
			isActive={isActive}
		/>
	})
	return (
		<div className={cn(
			"flex", "flex-col", "gap-4"
		)}>
			<h4 className={cn("text-secondary-text")}>{type}</h4>
			<div className={cn(
				'grid', 'flex-wrap', 'gap-3',
				'grid-cols-1', 'md:grid-cols-2', '2xl:grid-cols-3'
			)}>
				{themeButtons}
			</div>
		</div>
	)
}