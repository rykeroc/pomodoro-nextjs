import Button from "@/app/_components/Button";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {cx} from "class-variance-authority";
import {secondsToMinutes} from "@/app/_lib/dateTimeUtils";
import PomodoroStage from "@/app/_lib/PomodoroStage";

interface PomodoroTimerIndicatorProps {
	seconds: number
	maxSeconds: number
	taskName?: string
	stage: PomodoroStage
	className?: string
}

const PomodoroTimerIndicator = (
	{
		seconds,
		maxSeconds,
		taskName = "",
		stage = PomodoroStage.focusSession,
		...props
	}: PomodoroTimerIndicatorProps) => {
	const size = 450
	const strokeWidth = 8
	const viewBox = `0 0 ${size} ${size}`
	const radius = (size - strokeWidth) / 2
	const dashArray = radius * Math.PI * 2
	const percentage = Math.min(100, (seconds / maxSeconds) * 100)
	const dashOffset = dashArray - (dashArray * percentage) / 100
	const minutesString = secondsToMinutes(seconds)
	return (
		<svg
			width={size} height={size} viewBox={viewBox} {...props}>
			{/* Background */}
			<defs>
				<linearGradient id={"timerGradient"} x1="0%" y1="0%" x2="100%" y2="100%" className={"backdrop-blur-sm"}>
					<stop offset="0%" stopColor="#73767E"/>
					<stop offset="100%" stopColor="transparent"/>
				</linearGradient>
			</defs>
			<circle
				fill={"url(#timerGradient)"}
				cx={size / 2}
				cy={size / 2}
				r={radius}
			/>
			{/* Background circle */}
			<circle
				className={"fill-none stroke-secondary-text"}
				cx={size / 2}
				cy={size / 2}
				strokeWidth={`${strokeWidth - 1}px`}
				r={radius}
			/>
			{/* Progress circle*/}
			<circle
				className={"fill-none stroke-primary transition delay-200 ease-in"}
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeLinecap={"butt"}
				strokeWidth={`${strokeWidth}px`}
				strokeDasharray={dashArray}
				strokeDashoffset={dashOffset}
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
						className={cx(
							["text-primary-text"],
							{"invisible": stage === PomodoroStage.focusSession}
						)}>
						{stage.name}
					</h5>
					<h1>
						{minutesString}
					</h1>
					<Button>
						<h4 className={"text-secondary-text"}>
							{taskName}
						</h4>
						<ChevronRightIcon className={"size-8 fill-secondary-text"}/>
					</Button>
				</div>
			</foreignObject>
		</svg>
	)
}

export default PomodoroTimerIndicator
