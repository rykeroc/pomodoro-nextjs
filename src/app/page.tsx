"use client"

import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {HTMLAttributes, useState} from "react";
import Button, {ButtonProps} from "@/app/_components/Button";
import {Bars3Icon} from "@heroicons/react/16/solid";
import usePomodoro from "@/app/_lib/hooks/usePomodoro";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import {cn} from "@/app/_lib/cn";
import useQuoteQuery from "@/app/_lib/hooks/useQuoteQuery";


export default function Home() {
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

	// TODO
	const [taskName, setTaskName] = useState("Focus")

	const quote = useQuoteQuery()

	const PomodoroButtons = ({state}: { state: PomodoroState }) => {
		const buttonsMap: { [key: string]: ButtonProps } = {
			start: {children: "Start", onClick: start, variant: "primary"},
			resume: {children: "Resume", onClick: start, variant: "primary"},
			pause: {children: "Pause", onClick: pause, variant: "secondary"},
			finish: {children: "Finish", onClick: finish, variant: "secondary"},
			relax: {children: "Relax", onClick: relax, variant: "primary"},
			skip: {children: "Skip", onClick: finish, variant: "secondary"},
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
				'h-screen', 'w-screen',
				'flex', 'flex-col', 'justify-between', 'items-center'
			)}>
				{/* Menu button */}
				<NavMenu/>

				<FocusQuote>
					{quote.data?.content ?? ''}
				</FocusQuote>
			</div>

			{/* Timer elements */}
			<div className={cn(
				'fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
				'z-50',  // High z-index to ensure it's on top of other elements
				'flex', 'flex-col', 'justify-center', 'items-center', 'gap-6'
			)}>
				{/* Timer indicator */}
				<PomodoroTimerIndicator
					remainingSeconds={remaining}
					totalSeconds={total}
					taskName={taskName}
					stage={stage}
				/>

				<div className={"flex flex-row gap-3"}>
					{/* Timer buttons */}
					<PomodoroButtons state={state}/>
				</div>
			</div>
		</>
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
	<h6 className={"text-secondary-text py-6 px-12 text-center"}>
		{
			children ? `"${children}"` : ''
		}
	</h6>
