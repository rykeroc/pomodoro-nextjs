import {EBackgroundType, ITheme} from "@/app/_lib/contexts/theme/IThemeContext";
import {HTMLProps} from "react";
import Button from "@/app/_components/inputs/Button";
import Image from "next/image";
import {cn} from "@/app/_lib/utils/cn";

interface IThemeButtonProps extends HTMLProps<HTMLButtonElement> {
	theme: ITheme
}

function ThemeButton ({theme, onClick}: IThemeButtonProps)  {
	const themeImageFile = theme.backgroundType === EBackgroundType.Image ?
		`/backgrounds/images/${theme.backgroundFilename}` : `/backgrounds/videos/thumbnails/${theme.backgroundFilename}.png`

	return (
		<Button onClick={onClick}>
			<div className={cn('flex', 'flex-col', 'gap-1', 'items-start')}>
				{/* Image frame */}
				<div className={cn(
					'h-full', 'aspect-video', "flex-grow"
				)}>
					<Image
						className={cn(
							'h-full', 'w-full', 'object-cover', 'rounded-xl',
							'border-2', 'border-primary-container'
						)}
						src={themeImageFile}
						alt={`${theme.backgroundFilename}`}
						width={500}
						height={500}
					/>
				</div>
				<p>{theme.backgroundName}</p>
			</div>
		</Button>
	)
}

export default ThemeButton