import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/enums/PomodoroState";
import {getStageFromState, PomodoroStages} from "@/app/_lib/PomodoroStage";

export const elapsedSeconds = (remaining: number, total: number): number => total - remaining

export default function usePomodoro() {
	const [pomodoroState, setPomodoroState] = useState(PomodoroState.FocusPending)
	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStages.focusSession)
	const [focusCount, setFocusCount] = useState(0)

	// Keep pomodoro stage up to date
	useEffect(() => {
		const stage = getStageFromState(pomodoroState)
		setPomodoroStage(stage)
	}, [pomodoroState]);

	const {
		remainingSeconds, totalSeconds, status,
		startCountdown, pauseCountdown, resetCountdown, restartCountdown,
		setOnCompleteAction
	} = useCountdown(pomodoroStage.seconds)

	const onCompleteAction = useCallback(() => {
		setPomodoroState(prevState => (prevState === PomodoroState.FocusRunning) ?
				 PomodoroState.FocusComplete : PomodoroState.FocusPending
		)
	}, [setPomodoroState])

	// Set completion callback
	useEffect(() => {
		setOnCompleteAction(() => onCompleteAction)
	}, []);

	useEffect(() => {
		if (pomodoroState === PomodoroState.FocusComplete)
			setFocusCount(prev => prev + 1)
	}, [pomodoroState]);

	const start = useCallback(() => {
		startCountdown()
		setPomodoroState(PomodoroState.FocusRunning)
	}, [startCountdown, setPomodoroState])

	const pause = useCallback(() => {
		pauseCountdown()
		setPomodoroState(PomodoroState.FocusPaused)
	}, [pauseCountdown])

	const finish = useCallback(() => {
		resetCountdown(PomodoroStages.focusSession.seconds)
		setPomodoroState(PomodoroState.FocusPending)
	}, [setPomodoroState, resetCountdown, pomodoroStage])

	const relax = useCallback(() => {
		console.log(`Focus count: ${focusCount}`)
		restartCountdown(
			(focusCount % 4 === 0) ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds
		)
		setPomodoroState(() => (focusCount % 4 === 0) ?
				PomodoroState.LongBreakRunning : PomodoroState.ShortBreakRunning
		)
	}, [focusCount, setPomodoroState, restartCountdown])

	// TODO: Debugging state and status
	useEffect(() => {
		console.log(`Pomodoro state: ${pomodoroState}, Countdown Status: ${status}`)
	}, [status, pomodoroState]);


	return {
		remainingSeconds,
		totalSeconds,
		pomodoroStage,
		pomodoroState,
		relax,
		start,
		pause,
		finish,
	}
}