interface IColorClasses {
	text: string
	background: string
	stroke: string
	border: string
}

interface ITheme {
	wallpaperName: string
	wallpaperFilename: string
	colorClasses: IColorClasses
}

interface IThemeContext {
	globalThemes: ITheme[]
	selectedTheme: ITheme
	setSelectedTheme: (theme: ITheme) => void
}

export type {
	ITheme,
	IThemeContext
}