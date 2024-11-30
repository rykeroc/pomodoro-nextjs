"use client"

import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {ReactNode, useState} from "react";
import PomodoroStage from "@/app/_lib/PomodoroStage";
import {cx} from "class-variance-authority";
import Button from "@/app/_components/Button";
import PomodoroTimerStatus from "@/app/_lib/PomodoroTimerStatus";
import {Bars3Icon} from "@heroicons/react/16/solid";

function getTimerButtons(pomodoroStage: PomodoroStage, pomodoroTimerStatus: PomodoroTimerStatus): ReactNode {
	return (
		<div className={cx(
			['flex', 'flex-col', 'gap-3']
		)}>
			<Button variant={"primary"}>Start</Button>
		</div>
	)
}

export default function Home() {
	const [seconds, setSeconds] = useState(0)
	const [maxSeconds, setMaxSeconds] = useState(15000)
	const [taskName, setTaskName] = useState("Focus")

	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStage.ShortBreak)
	const [pomodoroTimerStatus, setPomodoroTimerStatus] = useState(PomodoroTimerStatus.Stopped)

	const [quote, setQuote] = useState("Focus")

	const timerButtons = getTimerButtons(pomodoroStage, pomodoroTimerStatus)

	return (
		<div className={cx(
			[
				'h-screen', 'w-screen',
				'flex', 'flex-col', 'justify-between', 'items-center'
			]
		)}>
			{/* Menu button */}
			<nav className={cx(
				[
					'w-full', 'p-5',
					'flex', 'flex-row', 'justify-end'
				])}>
				<Button variant={'glass'} className={'px-3'}>
					<Bars3Icon className={'size-5'}/>
				</Button>
			</nav>

			{/* Timer elements */}
			<div className={cx(
				[
					'flex', 'flex-col', 'justify-center', 'items-center', 'gap-6'
				]
			)}>
				{/* Timer indicator */}
				<PomodoroTimerIndicator
					seconds={seconds} maxSeconds={maxSeconds}
					taskName={taskName}
					stage={pomodoroStage}
				/>

				{/* Timer buttons */}
				{timerButtons}
			</div>

			<h6 className={"text-secondary-text p-5"}>
				"{quote}"
			</h6>
		</div>
	);
}
