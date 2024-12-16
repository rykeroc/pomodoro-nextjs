"use client"

import Button, {ButtonProps} from "@/app/_components/inputs/Button";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {secondsToMinutes} from "@/app/_lib/utils/dateTimeUtils";
import PomodoroStages from "@/app/_lib/constants/PomodoroStages";
import {cn} from "@/app/_lib/utils/cn";
import {glassEffectClasses} from "@/app/_components/common";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import usePomodoro from "@/app/_lib/hooks/usePomodoro";
import {useContext, useState} from "react";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import FocusQueueDialog from "@/app/_components/FocusQueueDialog";

const getElapsedSeconds = (remaining: number, total: number) => total - remaining

function PomodoroTimerIndicator() {
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

	const size = 450
	const strokeWidth = 8
	const viewBox = `0 0 ${size} ${size}`
	const radius = (size - strokeWidth) / 2
	const dashArray = radius * Math.PI * 2

	const remainingSeconds = stage === PomodoroStages.focusSession ?
		remaining : getElapsedSeconds(remaining, total)
	const percentage = Math.min(100, (remaining / total) * 100)

	const dashOffset = dashArray - (dashArray * percentage) / 100
	const minutesString = secondsToMinutes(remainingSeconds)

	const themeContext = useContext(ThemeContext)
	const strokeClass = themeContext?.theme.colorClasses.stroke
		? themeContext?.theme.colorClasses.stroke : "stroke-primary-text"

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const closeDialog = () => setIsDialogOpen(false)
	const openDialog = () => setIsDialogOpen(true)

	return (
		<>
			<div className={cn(
				'flex', 'flex-col', 'justify-center', 'items-center', 'gap-6'
			)}>
			<svg width={size} height={size} viewBox={viewBox}>
				{/* Background */}
				<foreignObject
					x={"0%"}
					y={"0%"}
					width={size}
					height={size}>
					<div className={cn(
						...glassEffectClasses,
						'rounded-full', 'absolute',
						'h-full', 'w-full'
					)}/>
				</foreignObject>

				{/* Outline circle */}
				<circle
					className={"fill-none stroke-primary-container opacity-75"}
					cx={size / 2}
					cy={size / 2}
					strokeWidth={`${strokeWidth - 1}px`}
					r={radius}
				/>

				{/* Progress circle*/}
				<circle
					className={cn(
						strokeClass,
						"fill-none",
						"transition-all", "ease-linear",
					)}
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeLinecap={"butt"}
					strokeWidth={`${strokeWidth}px`}
					strokeDasharray={dashArray}
					strokeDashoffset={isNaN(dashOffset) ? 0 : dashOffset}
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>

				{/* Timer details */}
				<foreignObject
					x={"0%"}
					y={"0%"}
					width={size}
					height={size}>
					<div
						className={"flex flex-col items-center justify-center w-full h-full gap-5"}>
						<h5
							className={cn(
								["text-primary-text"],
								{"invisible": stage === PomodoroStages.focusSession}
							)}>
							{stage.name}
						</h5>
						<h1>
							{minutesString}
						</h1>

						<Button onClick={openDialog}>
							<h4 className={"text-secondary-text"}>
								Focus {/* TODO	 */}
							</h4>
							<ChevronRightIcon className={"size-8 fill-secondary-text"}/>
						</Button>
					</div>
				</foreignObject>
			</svg>

			<div className={"flex flex-row gap-3"}>
				<PomodoroButtons state={state}/>
			</div>
			</div>
			<FocusQueueDialog isOpen={isDialogOpen} handleClose={closeDialog}/>
		</>
	)
}

export default PomodoroTimerIndicator
