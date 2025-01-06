interface IColorClasses {
	text: string
	background: string
	stroke: string
	border: string
}

enum EBackgroundType {
	Image, Video
}

interface ITheme {
	id: number
	backgroundName: string
	backgroundFilename: string
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