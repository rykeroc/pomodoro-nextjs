"use client"

import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {HTMLAttributes, useContext, useState} from "react";
import Button, {ButtonProps} from "@/app/_components/inputs/Button";
import {Bars3Icon} from "@heroicons/react/16/solid";
import usePomodoro from "@/app/_lib/hooks/usePomodoro";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import {cn} from "@/app/_lib/utils/cn";
import useQuoteQuery from "@/app/_lib/hooks/useQuoteQuery";
import Image from "next/image";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import {IThemeContext} from "@/app/_lib/contexts/theme/IThemeContext";
import Sidebar from "@/app/_components/sidebar/Sidebar";


export default function Home() {
	// TODO
	const [showSidebar, setShowSidebar] = useState(false)
	const handleShowSidebar = () => setShowSidebar(true)
	const handleHideSidebar = () => setShowSidebar(false)

	const {
		remaining,
		total,
		stage,
		state,
		start,
		pause,
		finish,
		relax
	} = usePomodoro()

	const quote = useQuoteQuery()

	const PomodoroButtons = ({state}: { state: PomodoroState }) => {
		const buttonsMap: { [key: string]: ButtonProps } = {
			start: {children: "Start", onClick: start, variant: "primary"},
			resume: {children: "Resume", onClick: start, variant: "primary"},
			pause: {children: "Pause", onClick: pause, variant: "glass"},
			finish: {children: "Finish", onClick: finish, variant: "glass"},
			relax: {children: "Relax", onClick: relax, variant: "primary"},
			skip: {children: "Skip", onClick: finish, variant: "glass"},
		}

		const selectedButtons = []
		switch (state) {
			case PomodoroState.FocusPending:
				selectedButtons.push(buttonsMap.start)
				break
			case PomodoroState.FocusRunning:
				selectedButtons.push(buttonsMap.pause)
				break
			case PomodoroState.FocusPaused:
				selectedButtons.push(buttonsMap.resume, buttonsMap.finish)
				break
			case PomodoroState.FocusComplete:
				selectedButtons.push(buttonsMap.relax, buttonsMap.skip)
				break
			default:
				selectedButtons.push(buttonsMap.finish)
		}

		return selectedButtons.map((b, index) =>
			<Button key={index} variant={b.variant} onClick={b.onClick}>
				{b.children}
			</Button>
		)
	}

	return (
		<>
			<div className={cn(
				'fixed', 'z-40', 'h-screen', 'w-screen',
				'flex', 'flex-col', 'justify-between', 'items-center'
			)}>
				<div className={cn('w-full', 'p-5', 'flex', 'flex-row', 'justify-end')}>
					{/* Menu button */}
					<Button variant={'glass'} className={'px-3'} onClick={handleShowSidebar}>
						<Bars3Icon className={'size-5'}/>
					</Button>
				</div>

				<FocusQuote>
					{quote.data?.q ?? ''}
				</FocusQuote>
			</div>

			<Sidebar show={showSidebar} handleHide={handleHideSidebar}/>

			{/* Timer elements */}
			<div className={cn(
				'fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
				'z-40',  // High z-index to ensure it's on top of other elements
				'flex', 'flex-col', 'justify-center', 'items-center', 'gap-6'
			)}>
				{/* Timer indicator */}
				<PomodoroTimerIndicator
					remainingSeconds={remaining}
					totalSeconds={total}
					taskName={'Focus'} // TODO
					stage={stage}
				/>

				<div className={"flex flex-row gap-3"}>
					{/* Timer buttons */}
					<PomodoroButtons state={state}/>
				</div>
			</div>

			{/* Wallpaper background */}
			<ThemeImage/>
		</>
	);
}


const FocusQuote = ({children, className}: HTMLAttributes<HTMLHeadingElement>) =>
	<h6 className={cn(
		className,
		"text-secondary-text", "py-6", "px-12", "text-center"
	)}>
		{
			children ? `"${children}"` : ''
		}
	</h6>

const ThemeImage = () => {
	const themeContext = useContext<IThemeContext | null>(ThemeContext)

	return <Image
		className={cn(
			"z-0", 'h-screen', 'w-screen',
			'object-cover', 'brightness-75',
			'fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
		)}
		src={`/wallpapers/${themeContext?.theme.wallpaperFilename}`}
		alt={"Lofi coffee shop wallpaper"}
		width={3840}
		height={2160}
	/>
}