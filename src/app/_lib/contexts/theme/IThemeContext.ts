interface IColorClasses {
	text: string
	background: string
	stroke: string
	border: string
}

interface ITheme {
	id: number
	wallpaperName: string
	wallpaperFilename: string
	colorClasses: IColorClasses
}

interface IThemeContext {
	theme: ITheme
	setTheme: (theme: ITheme) => void
	error: string | null
	globalThemes: ITheme[]
}

export type {
	ITheme,
	IThemeContext
}