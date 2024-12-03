import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import {PomodoroStageInfo, PomodoroStages} from "@/app/_lib/constants/PomodoroStage";

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

	const {
		remaining, total,
		startCountdown, pauseCountdown, resetCountdown, restartCountdown,
		setOnCompleteAction
	} = useCountdown(info.stage.seconds)

	// Debugging logs
	useEffect(() => {
		console.log(`Focus Count updated: ${info.focusCount}`)
	}, [info.focusCount]);

	const onCompleteAction = useCallback(() => {
		setInfo(prev => {
			// Update focus count if focus session was completed
			let newFocusCount = prev.focusCount
			if (prev.state === PomodoroState.FocusRunning) {
				newFocusCount++
			}

			/*
			If previous state was running Focus session, set state to Focus complete
			Else previous state was short or long break, so set state to Focus Pending
			 */
			const newState = prev.state === PomodoroState.FocusRunning ?
				PomodoroState.FocusComplete : PomodoroState.FocusPending

			// Next stage will always be focus session
			const newStage = PomodoroStages.focusSession

			// Reset countdown if break was completed
			if (newState === PomodoroState.FocusPending)
				resetCountdown(newStage.seconds)

			return {focusCount: newFocusCount, state: newState, stage: newStage}
		})
	}, [setInfo])

	// Set completion callback
	useEffect(() => {
		setOnCompleteAction(() => onCompleteAction)
	});

	const start = useCallback(() => {
		startCountdown()
		// Update pomodoro state to running
		setInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
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
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusPending
			}
		))
	}, [
		resetCountdown, setInfo
	])

	const relax = useCallback(() => {
		const isLongBreak = (info.focusCount % 4) === 0
		const seconds = isLongBreak ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds
		restartCountdown(seconds)
		setInfo(prev => (
			{
				...prev,
				stage: isLongBreak ? PomodoroStages.longBreak : PomodoroStages.shortBreak,
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