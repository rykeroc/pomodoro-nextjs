import {EBackgroundType, ITheme} from "@/app/_lib/contexts/theme/IThemeContext";
import {HTMLProps} from "react";
import Button from "@/app/_components/inputs/Button";
import Image from "next/image";
import {cn} from "@/app/_lib/utils/cn";
import {cx} from "class-variance-authority";

interface IThemeButtonProps extends HTMLProps<HTMLButtonElement> {
	theme: ITheme
	isActive: boolean
}

function ThemeButton ({theme, isActive, onClick}: IThemeButtonProps)  {
	const themeImageFile = theme.backgroundType === EBackgroundType.Static ?
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
							'h-full', 'w-full', 'object-cover', 'rounded-xl', 'border-2',
							cx({
								'border-secondary-text': isActive,
								'border-primary-container': !isActive
							})
						)}
						src={themeImageFile}
						alt={`${theme.backgroundFilename}`}
						width={500}
						height={500}
					/>
				</div>
			</div>
		</Button>
	)
}

export default ThemeButton