import {ITheme} from "@/app/_lib/contexts/theme/IThemeContext";

const globalThemes: ITheme[] = [
	{
		wallpaperFilename: "anime-wallpaper-1.jpg",
		colorClasses: {
			text: "text-violet-900",
			background: "bg-violet-900",
			stroke: "stroke-violet-900",
			border: "border-violet-900"
		}
	},
	{
		wallpaperFilename: "sunset-wallpaper.jpg",
		colorClasses: {
			text: "text-amber-600",
			background: "bg-amber-600",
			stroke: "stroke-amber-600",
			border: "border-amber-600"
		}
	}
]

export default globalThemes