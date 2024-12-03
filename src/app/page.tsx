"use client"

import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {HTMLAttributes, ReactNode, useState} from "react";
import Button from "@/app/_components/Button";
import {Bars3Icon} from "@heroicons/react/16/solid";
import usePomodoro from "@/app/_lib/hooks/usePomodoro";
import PomodoroState from "@/app/_lib/enums/PomodoroState";
import {cn} from "@/app/_lib/cn";


export default function Home() {
	const {
		remainingSeconds,
		totalSeconds,
		pomodoroStage,
		pomodoroState,
		start,
		pause,
		finish,
		relax
	} = usePomodoro()

	const [taskName, setTaskName] = useState("Focus")

	const [quote, setQuote] = useState("Focus")

	const PomodoroButtons = ({state}: { state: PomodoroState }) => {
		const buttons = {
			start: <Button variant={"primary"} onClick={start}>Start</Button>,
			resume: <Button variant={"primary"} onClick={start}>Resume</Button>,
			pause: <Button variant={"secondary"} onClick={pause}>Pause</Button>,
			finish: <Button variant={"secondary"} onClick={finish}>Finish</Button>,
			relax: <Button variant={"primary"} onClick={relax}>Relax</Button>,
			skip: <Button variant={"secondary"} onClick={finish}>Skip</Button>
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
			<div className={"flex flex-row gap-3"}>
				{selectedButtons.map((b, index) => <div key={index}>{b}</div> )}
			</div>
		)
	}

	return (
		<div className={cn(
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
				<PomodoroButtons state={pomodoroState}/>
			</div>

			<FocusQuote>
				{quote}
			</FocusQuote>
		</div>
	);
}

const NavMenu = () =>
	<nav className={cn(
		[
			'w-full', 'p-5',
			'flex', 'flex-row', 'justify-end'
		])}>
		<Button variant={'glass'} className={'px-3'}>
			<Bars3Icon className={'size-5'}/>
		</Button>
	</nav>

const FocusQuote = ({children}: HTMLAttributes<HTMLHeadingElement>) =>
	<h6 className={"text-secondary-text p-5"}>"{children}"</h6>
