"use client"

import Image from "next/image";
import {cn} from "@/app/_lib/utils/cn";
import {useContext} from "react";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";
import {EBackgroundType, ITheme} from "@/app/_lib/contexts/theme/IThemeContext";

type Dimensions = [width: number, height: number]
const backgroundDimensions: Dimensions = [3840, 2160]

export default function BackgroundTheme() {
	const themeContext = useContext(ThemeContext)
	const theme = themeContext?.theme ?? globalThemes[0]

	return (theme.backgroundType === EBackgroundType.Image) ? (
		// Display image background
		<BackgroundImage theme={theme}/>
	) : (
		// Display video background

		<BackgroundVideo theme={theme}/>
	)
}

interface IBackgroundImageProps {
	theme: ITheme
}

function BackgroundImage({theme}: IBackgroundImageProps) {
	const imageSrc = `/backgrounds/images/${theme.backgroundFilename}`
	return <Image
		className={cn('object-cover', 'brightness-75', 'h-screen', 'w-screen',)}
		src={imageSrc}
		alt={theme.themeName}
		width={backgroundDimensions[0]}
		height={backgroundDimensions[1]}
	/>
}

interface IBackgroundVideoProps {
	theme: ITheme
}

function BackgroundVideo({theme}: IBackgroundVideoProps) {
	const videoSrc = `/backgrounds/videos/${theme.backgroundFilename}`
	const srcType = "video/mp4"
	return (
		<video
			className={cn('object-cover', 'brightness-80', 'h-screen', 'w-screen',)}
			autoPlay loop muted>
			<source src={videoSrc} type={srcType}/>
		</video>
	)
}

