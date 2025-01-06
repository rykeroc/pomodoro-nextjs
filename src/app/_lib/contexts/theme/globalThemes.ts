import {EBackgroundType, ITheme} from "@/app/_lib/contexts/theme/IThemeContext";

const globalThemes: ITheme[] = [
	{
		id: 1,
		themeName: "City Sunset View",
		backgroundFilename: "anime-wallpaper-1.jpg",
		backgroundType: EBackgroundType.Image,
		colorClasses: {
			text: "text-violet-900",
			background: "bg-violet-900",
			stroke: "stroke-violet-900",
			border: "border-violet-900"
		}
	},
	{
		id: 2,
		themeName: "Ocean Sunset View",
		backgroundFilename: "sunset-wallpaper.jpg",
		backgroundType: EBackgroundType.Image,
		colorClasses: {
			text: "text-amber-600",
			background: "bg-amber-600",
			stroke: "stroke-amber-600",
			border: "border-amber-600"
		}
	},
	{
		id: 3,
		themeName: "All Girls Are The Same",
		backgroundFilename: "all-girls-are-the-same.mp4",
		backgroundType: EBackgroundType.Video,
		colorClasses: {
			text: "text-blue-500",
			background: "bg-blue-500",
			stroke: "stroke-blue-500",
			border: "border-blue-500"
		}
	}
]

export default globalThemes