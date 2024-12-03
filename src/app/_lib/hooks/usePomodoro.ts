import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import {getStageFromState, PomodoroStageInfo, PomodoroStages} from "@/app/_lib/constants/PomodoroStage";

interface Pomodoro {
	remaining: number
	total: number
	stage: PomodoroStageInfo,
	state: PomodoroState,
	relax: () => void
	start: () => void
	pause: () => void
	finish: () => void
}

interface PomodoroInfo {
	state: PomodoroState
	stage: PomodoroStageInfo
	focusCount: number
}

export default function usePomodoro(): Pomodoro {
	const [info, setInfo] = useState<PomodoroInfo>({
		state: PomodoroState.FocusPending,
		stage: PomodoroStages.focusSession,
		focusCount: 0
	})

	// Keep pomodoro stage up to date
	useEffect(() => {
		const stage = getStageFromState(info.state)
		setInfo(prevState => (
			{
				...prevState,
				stage
			}
		))
	}, [info.state]);

	const {
		remaining, total,
		startCountdown, pauseCountdown, resetCountdown, restartCountdown,
		setOnCompleteAction
	} = useCountdown(info.stage.seconds)

	const onCompleteAction = useCallback(() => {
		setInfo(prev => (
				{
					...prev,
					state: (prev.state === PomodoroState.FocusRunning) ?
						PomodoroState.FocusComplete : PomodoroState.FocusPending
				}
			)
		)
	}, [setInfo])

	// Set completion callback
	useEffect(() => {
		setOnCompleteAction(() => onCompleteAction)
	}, []);


	useEffect(() => {
		// Update focus count if focus has been completed
		if (info.state === PomodoroState.FocusComplete) {
			setInfo(prev => (
				{
					...prev,
					focusCount: prev.focusCount + 1
				}
			))
		}

		// Reset countdown if break was completed
		else if (info.state === PomodoroState.FocusPending) {
			resetCountdown(PomodoroStages.focusSession.seconds)
		}
	}, [info.state, setInfo]);

	const start = useCallback(() => {
		startCountdown()
		// Update pomodoro state to running
		setInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusRunning
			}
		))
	}, [startCountdown, setInfo])

	const pause = useCallback(() => {
		pauseCountdown()
		// Update pomodoro state to paused
		setInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusPaused
			}
		))
	}, [pauseCountdown, setInfo])

	const finish = useCallback(() => {
		resetCountdown(PomodoroStages.focusSession.seconds)
		setInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusPending
			}
		))
	}, [
		resetCountdown, setInfo
	])

	const relax = useCallback(() => {
		console.log(`Focus count: ${info.focusCount}`)
		const isLongBreak = (info.focusCount % 4) === 0
		const seconds = isLongBreak ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds
		restartCountdown(seconds)
		setInfo(prev => (
			{
				...prev,
				state: isLongBreak ? PomodoroState.LongBreakRunning : PomodoroState.ShortBreakRunning
			}
		))
	}, [info.focusCount, restartCountdown, setInfo])


	return {
		remaining,
		total,
		stage: info.stage,
		state: info.state,
		relax,
		start,
		pause,
		finish,
	}
}