import {ITheme} from "@/app/_lib/contexts/theme/IThemeContext";
import {HTMLProps} from "react";
import Button from "@/app/_components/inputs/Button";
import {cn} from "@/app/_lib/utils/cn";
import Button from "@/components/common/Button";
import Image from "next/image";
import {cn} from "@/lib/cn";
import {cx} from "class-variance-authority";
import {LinkIcon} from "@heroicons/react/24/solid";
import {EBackgroundType, ITheme} from "@/lib/theme/types";

interface IThemeButtonProps extends HTMLProps<HTMLButtonElement> {
	theme: ITheme
	isActive: boolean
}

function ThemeButton({theme, isActive, onClick}: IThemeButtonProps) {

	return (
		<div className={cn(
			"relative", "group"
		)}>
			<Button onClick={onClick}>
				<div className={cn('flex', 'flex-col', 'gap-1', 'items-start')}>
					{/* Image frame */}
					<div className={cn(
						'h-full', 'aspect-video', "flex-grow"
					)}>
						<img
							className={cn(
								'h-full', 'w-full', 'object-cover', 'rounded-xl', 'border-2',
								cx({
									'border-secondary-text': isActive,
									'border-primary-container': !isActive
								})
							)}
							src={theme.thumbnail}
							alt={`${theme.backgroundFile}`}
							width={500}
							height={500}
						/>
					</div>
				</div>
			</Button>

			<div className={cn(
				"absolute", "z-10", "pt-2",
				"hidden", "hover:block", "group-hover:block",
				"transform", "left-0", "top-full",
			)}>
				<div className={cn(
					"py-1", "px-2", "rounded-lg", "bg-background",
				)}>
					<a href={theme.backgroundSrc} target={"_blank"}
					   className={cn("flex", "flex-row", "gap-2", "items-center")}
					>
						<p>{theme.themeName}</p>
						{
							theme.backgroundSrc && <LinkIcon className={cn("size-4")}/>
						}
					</a>
				</div>
			</div>
		</div>
	)
}

export default ThemeButton