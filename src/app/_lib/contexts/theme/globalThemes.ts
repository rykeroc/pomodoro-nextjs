import {EBackgroundType, ITheme} from "@/app/_lib/contexts/theme/IThemeContext";

const globalThemes: ITheme[] = [
	{
		id: 1,
		backgroundName: "City Sunset View",
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
		backgroundName: "Ocean Sunset View",
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
		backgroundName: "All Girls Are The Same",
		backgroundFilename: "all-girls-are-the-same.mp4",
		backgroundType: EBackgroundType.Video,
		colorClasses: {
			text: "text-amber-600",
			background: "bg-amber-600",
			stroke: "stroke-amber-600",
			border: "border-amber-600"
		}
	}
]

export default globalThemes