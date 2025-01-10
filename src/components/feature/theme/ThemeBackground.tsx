"use client"

import {cn} from "@/app/_lib/utils/cn";
import Image from "next/image";
import {cn} from "@/lib/cn";
import {ReactElement, } from "react";
import {EBackgroundType, ITheme} from "@/lib/theme/types";
import useUserPreferences from "@/hooks/useUserPreferences";

type Dimensions = [width: number, height: number]
const backgroundDimensions: Dimensions = [3840, 2160]

export default function ThemeBackground() {
	const {theme} = useUserPreferences()
	const backgroundComponent: ReactElement = (theme.backgroundType === EBackgroundType.Static) ? (
		// Display image background
		<StaticBackground theme={theme}/>
	) : (
		// Display video background

		<LiveBackground theme={theme}/>
	)
	return (
		<div>
			{backgroundComponent}
		</div>
	)
}

interface IBackgroundImageProps {
	theme: ITheme
}

function StaticBackground({theme}: IBackgroundImageProps) {
	return <img
		className={cn('object-cover', 'brightness-75', 'h-screen', 'w-screen',)}
		src={theme.backgroundFile}
		alt={theme.themeName}
		width={backgroundDimensions[0]}
		height={backgroundDimensions[1]}
	/>
}

interface IBackgroundVideoProps {
	theme: ITheme
}

function LiveBackground({theme}: IBackgroundVideoProps) {
	const srcType = "video/mp4"
	return (
		<video
			className={cn('object-cover', 'brightness-80', 'h-screen', 'w-screen',)}
			autoPlay loop muted>
			<source src={theme.backgroundFile} type={srcType}/>
		</video>
	)
}

