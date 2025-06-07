interface IColorClasses {
	text: string
	background: string
	stroke: string
	border: string
}

enum EBackgroundType {
	Static, Live
}

interface ITheme {
	id: number
	themeName: string
	thumbnail: string
	backgroundFile: string
	backgroundSrc?: string
	backgroundType: EBackgroundType
	colorClasses: IColorClasses
}

interface IThemeContext {
	theme: ITheme
	setTheme: (theme: ITheme) => void
	error: string | null
	globalThemes: ITheme[]
}

export {
	EBackgroundType,
}

export type {
	ITheme,
	IThemeContext
}