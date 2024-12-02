"use client"

import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {HTMLAttributes, ReactNode, useState} from "react";
import {cx} from "class-variance-authority";
import Button from "@/app/_components/Button";
import {Bars3Icon} from "@heroicons/react/16/solid";
import usePomodoro from "@/app/_lib/hooks/usePomodoro";
import PomodoroState from "@/app/_lib/enums/PomodoroState";


export default function Home() {
	const {
		remainingSeconds,
		totalSeconds,
		pomodoroStage,
		pomodoroState,
		startPomodoro,
		pausePomodoro,
		finishPomodoro,
		startNext
	} = usePomodoro()

	const [taskName, setTaskName] = useState("Focus")

	const [quote, setQuote] = useState("Focus")

	const pomodoroButtons = <PomodoroButtons state={pomodoroState}/>

	return (
		<div className={cx(
			[
				'h-screen', 'w-screen',
				'flex', 'flex-col', 'justify-between', 'items-center'
			]
		)}>
			{/* Menu button */}
			<NavMenu/>

			{/* Timer elements */}
			<div className={'flex flex-col justify-center items-center gap-6'}>
				{/* Timer indicator */}
				<PomodoroTimerIndicator
					seconds={remainingSeconds}
					totalSeconds={totalSeconds}
					taskName={taskName}
					stage={pomodoroStage}
				/>

				{/* Timer buttons */}
				{pomodoroButtons}
			</div>

			<FocusQuote>
				{quote}
			</FocusQuote>
		</div>
	);
}

const NavMenu = () =>
	<nav className={cx(
		[
			'w-full', 'p-5',
			'flex', 'flex-row', 'justify-end'
		])}>
		<Button variant={'glass'} className={'px-3'}>
			<Bars3Icon className={'size-5'}/>
		</Button>
	</nav>

const PomodoroButtons = ({state}: { state: PomodoroState }) => {
	const buttons = {
		start: <Button variant={"primary"}>Start</Button>,
		resume: <Button variant={"primary"}>Resume</Button>,
		pause: <Button variant={"secondary"}>Pause</Button>,
		finish: <Button variant={"secondary"}>Finish</Button>,
		relax: <Button variant={"primary"}>Relax</Button>,
		skip: <Button variant={"secondary"}>Skip</Button>
	}

	let selectedButtons: ReactNode[] = []
	switch (state) {
		case PomodoroState.FocusPending:
			selectedButtons.push(buttons.start)
			break
		case PomodoroState.FocusRunning:
			selectedButtons.push(buttons.pause)
			break
		case PomodoroState.FocusPaused:
			selectedButtons.push(buttons.resume, buttons.finish)
			break
		case PomodoroState.FocusComplete:
			selectedButtons.push(buttons.relax, buttons.skip)
			break
		default:
			selectedButtons.push(buttons.finish)
	}
	return (
		<div className={cx(
			["flex", "flex-row", "gap-3"]
		)}>
			{selectedButtons.map((b, index) => <div key={index}>{b}</div> )}
		</div>
	)
}

const FocusQuote = ({children}: HTMLAttributes<HTMLHeadingElement>) =>
	<h6 className={"text-secondary-text p-5"}>"{children}"</h6>
