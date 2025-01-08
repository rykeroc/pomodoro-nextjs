import Button, {ButtonProps} from "@/app/_components/inputs/Button";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {secondsToMinutes} from "@/app/_lib/utils/dateTimeUtils";
import PomodoroStages from "@/app/_lib/constants/PomodoroStages";
import {cn} from "@/app/_lib/utils/cn";
import {glassEffectClasses} from "@/app/_components/common";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import {useContext} from "react";
import ThemeContext from "@/app/_lib/contexts/theme/ThemeContext";
import {IPomodoroTimer} from "@/app/_lib/hooks/usePomodoro";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import PomodoroFocusCountIndicators from "@/app/_components/pomodoro/PomodoroFocusCountIndicators";
import {useSession} from "next-auth/react";

interface IPomodoroTimerIndicatorProps {
	pomodoroTimer: IPomodoroTimer
	focusTasksData: IFocusTasksData
	handleOpen: () => void,
}

function PomodoroTimer({pomodoroTimer, focusTasksData, handleOpen}: IPomodoroTimerIndicatorProps) {
	const activeTaskName = focusTasksData.activeTask?.name ?? "Focus"
	const {data: session} = useSession()

	const focusTaskSelectorButton = (
		<Button onClick={handleOpen} disabled={!session}>
			<h4 className={"text-secondary-text"}>
				{activeTaskName}
			</h4>
			{
				session && (
					<ChevronRightIcon className={"size-8 fill-secondary-text"}/>
				)
			}
		</Button>
	)

	const getElapsedSeconds = (remaining: number, total: number) => total - remaining

	const PomodoroButtons = ({state}: { state: PomodoroState }) => {
		const buttonsMap: { [key: string]: ButtonProps } = {
			start: {children: "Start", onClick: pomodoroTimer.start, variant: "primary"},
			resume: {children: "Resume", onClick: pomodoroTimer.resume, variant: "primary"},
			pause: {children: "Pause", onClick: pomodoroTimer.pause, variant: "glass"},
			finish: {children: "Finish", onClick: pomodoroTimer.finish, variant: "glass"},
			relax: {children: "Relax", onClick: pomodoroTimer.relax, variant: "primary"},
			skip: {children: "Skip", onClick: pomodoroTimer.skip, variant: "glass"},
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

	const remainingSeconds = pomodoroTimer.stage === PomodoroStages.focusSession ?
		pomodoroTimer.remaining : getElapsedSeconds(pomodoroTimer.remaining, pomodoroTimer.total)

	const percentage = Math.min(100, (remainingSeconds / pomodoroTimer.total) * 100)

	const dashOffset = dashArray - (dashArray * percentage) / 100
	const minutesString = secondsToMinutes(remainingSeconds)

	const themeContext = useContext(ThemeContext)
	const strokeClass = themeContext?.theme.colorClasses.stroke
		? themeContext?.theme.colorClasses.stroke : "stroke-primary-text"


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
							<h5 className={cn(
									["text-primary-text"],
									{ "invisible": pomodoroTimer.stage === PomodoroStages.focusSession }
								)}>
								{pomodoroTimer.stage.name}
							</h5>

							<div className={cn("flex", "flex-col", "gap-1", "items-center")}>
								<PomodoroFocusCountIndicators focusCount={pomodoroTimer.focusCount}/>

								<h1>
									{minutesString}
								</h1>
							</div>

							{focusTaskSelectorButton}

						</div>
					</foreignObject>
				</svg>

				<div className={"flex flex-row gap-3"}>
					<PomodoroButtons state={pomodoroTimer.state}/>
				</div>
			</div>
		</>
	)
}


export default PomodoroTimer
