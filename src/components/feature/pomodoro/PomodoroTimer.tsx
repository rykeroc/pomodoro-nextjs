import Button, {IButtonProps} from "@/components/common/Button";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {secondsToMinutes} from "@/lib/dateTimeHelpers";
import {cn} from "@/lib/cn";
import {glassEffectClasses} from "@/components/common";
import {IPomodoroTimer, PomodoroStages, EPomodoroState} from "@/hooks/usePomodoro";
import {IFocusTasksData} from "@/hooks/useFocusTasksData";
import PomodoroFocusCountIndicators from "@/components/feature/pomodoro/PomodoroFocusCountIndicators";
import {useSession} from "next-auth/react";
import useUserPreferences from "@/hooks/useUserPreferences";

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
			<h4 className={cn(
				"text-left", "line-clamp-1", "overflow-ellipsis",
				"text-secondary-text",
			)}>
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

	const PomodoroButtons = ({state}: { state: EPomodoroState }) => {
		const buttonsMap: { [key: string]: IButtonProps } = {
			start: {children: "Start", onClick: pomodoroTimer.start, variant: "primary"},
			resume: {children: "Resume", onClick: pomodoroTimer.resume, variant: "primary"},
			pause: {children: "Pause", onClick: pomodoroTimer.pause, variant: "glass"},
			finish: {children: "Finish", onClick: pomodoroTimer.finish, variant: "glass"},
			relax: {children: "Relax", onClick: pomodoroTimer.relax, variant: "primary"},
			skip: {children: "Skip", onClick: pomodoroTimer.skip, variant: "glass"},
		}

		const selectedButtons = []
		switch (state) {
			case EPomodoroState.FocusPending:
				selectedButtons.push(buttonsMap.start)
				break
			case EPomodoroState.FocusRunning:
				selectedButtons.push(buttonsMap.pause)
				break
			case EPomodoroState.FocusPaused:
				selectedButtons.push(buttonsMap.resume, buttonsMap.finish)
				break
			case EPomodoroState.FocusComplete:
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

	const baseSize = 450
	const strokeWidth = 8
	const viewBox = `0 0 ${baseSize} ${baseSize}`
	const radius = (baseSize - strokeWidth) / 2
	const dashArray = radius * Math.PI * 2

	const remainingSeconds = pomodoroTimer.stage === PomodoroStages.focusSession ?
		pomodoroTimer.remaining : getElapsedSeconds(pomodoroTimer.remaining, pomodoroTimer.total)

	const percentage = Math.min(100, (remainingSeconds / pomodoroTimer.total) * 100)

	const dashOffset = dashArray - (dashArray * percentage) / 100
	const minutesString = secondsToMinutes(remainingSeconds)

	const {theme} = useUserPreferences()
	const strokeClass = theme.colorClasses.stroke ?? "stroke-primary-text"

	return (
			<div className={cn(
				'flex', 'flex-col', 'justify-center', 'items-center', 'gap-6', 'w-full'
			)}>
				<svg viewBox={viewBox}
				     className={cn(
						 'w-full',
						 'max-w-[450px]',
						 'h-auto',
					     'rounded-full',
						 'z-40',
						 ...glassEffectClasses,
				     )}
				>
					{/* Outline circle */}
					<circle
						className={"fill-none stroke-primary-container opacity-75"}
						cx={baseSize / 2}
						cy={baseSize / 2}
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
						cx={baseSize / 2}
						cy={baseSize / 2}
						r={radius}
						strokeLinecap={"butt"}
						strokeWidth={`${strokeWidth}px`}
						strokeDasharray={dashArray}
						strokeDashoffset={isNaN(dashOffset) ? 0 : dashOffset}
						transform={`rotate(-90 ${baseSize / 2} ${baseSize / 2})`}
					/>
				</svg>


				{/* Overlay timer content */}
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-50 pointer-events-none">
					<h5 className={cn(
						'text-primary-text',
						{ 'invisible': pomodoroTimer.stage === PomodoroStages.focusSession }
					)}>
						{pomodoroTimer.stage.name}
					</h5>

					<div className="flex flex-col gap-1 items-center">
						<PomodoroFocusCountIndicators focusCount={pomodoroTimer.focusCount} />
						<h1 className={cn("text-7xl", "md:text-8xl")}>{minutesString}</h1>
					</div>

					<div className={cn("pointer-events-auto")}>
						{focusTaskSelectorButton}
					</div>

					<h5 className={'invisible'}>
						Hidden spacer
					</h5>
				</div>

				<div className={"flex flex-row gap-3"}>
					<PomodoroButtons state={pomodoroTimer.state}/>
				</div>
			</div>
	)
}

export default PomodoroTimer
