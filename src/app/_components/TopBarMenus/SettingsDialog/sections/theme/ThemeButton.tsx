import {ITheme} from "@/app/_lib/contexts/theme/IThemeContext";
import {HTMLProps} from "react";
import Button from "@/app/_components/inputs/Button";
import Image from "next/image";
import {cn} from "@/app/_lib/utils/cn";

interface IThemeButtonProps extends HTMLProps<HTMLButtonElement>{
	theme: ITheme
}

const ThemeButton = ({theme, onClick}: IThemeButtonProps) => (
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
					src={`/wallpapers/${theme.backgroundFilename}`}
					alt={`${theme.backgroundFilename}`}
					width={500}
					height={500}
				/>
			</div>
			<p>{theme.backgroundName}</p>
		</div>
	</Button>
)

export default ThemeButton