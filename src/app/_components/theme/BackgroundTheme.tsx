"use client"

import Image from "next/image";
import {cn} from "@/app/_lib/utils/cn";
import {useContext} from "react";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";

export default function BackgroundTheme (){
	const themeContext = useContext(ThemeContext)
	const theme = themeContext?.theme ?? globalThemes[0]
	return <Image
		className={cn(
			'object-cover', 'brightness-75',
			'h-screen', 'w-screen',
		)}
		src={`/wallpapers/${theme.backgroundFilename}`}
		alt={theme.backgroundName}
		width={3840}
		height={2160}
	/>
}

