import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import PomodoroStages, {PomodoroStageInfo} from "@/app/_lib/constants/PomodoroStages";
import useFocusTasksData, {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";

interface PomodoroInfo {
	state: PomodoroState
	stage: PomodoroStageInfo
	focusCount: number
}

export interface IPomodoroTimer {
	remaining: number
	total: number
	stage: PomodoroStageInfo,
	state: PomodoroState,
	relax: () => void
	start: () => void
	pause: () => void
	finish: () => void
}

export interface IPomodoro extends IPomodoroTimer, IFocusTasksData {}

export default function usePomodoro(userId: string): IPomodoro {
	const [info, setInfo] = useState<PomodoroInfo>({
		state: PomodoroState.FocusPending,
		stage: PomodoroStages.focusSession,
		focusCount: 0
	})

	const focusTasksData = useFocusTasksData(userId)

	const countdown = useCountdown(info.stage.seconds)

	// Debugging logs
	useEffect(() => {
		console.log(`Focus Count updated: ${info.focusCount}`)
	}, [info.focusCount]);

	/*
	 Called when the countdown completes.

	 The countdown completes when in the following states:
	 - Focus running
	 - Short break running
	 - Long break running
	 */
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

			return {focusCount: newFocusCount, state: newState, stage: newStage}
		})
	}, [setInfo])

	// Set completion callback
	useEffect(() => {
		countdown.setOnCompleteAction(() => onCompleteAction)
	});

	// Auto reset countdown if break was completed
	useEffect(() => {
		if (info.state === PomodoroState.FocusPending)
			countdown.resetCountdown(info.stage.seconds)
	}, [info.state, info.stage.seconds, countdown.resetCountdown]);

	const start = useCallback(() => {
		countdown.startCountdown()
		// Update pomodoro state to running
		setInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusRunning
			}
		))
	}, [countdown.startCountdown, setInfo])

	const pause = useCallback(() => {
		countdown.pauseCountdown()
		// Update pomodoro state to paused
		setInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusPaused
			}
		))
	}, [countdown.pauseCountdown, setInfo])

	const finish = useCallback(() => {
		countdown.resetCountdown(PomodoroStages.focusSession.seconds)
		setInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusPending
			}
		))
	}, [
		countdown.resetCountdown, setInfo
	])

	const relax = useCallback(() => {
		const isLongBreak = (info.focusCount % 4) === 0
		const seconds = isLongBreak ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds
		countdown.restartCountdown(seconds)
		setInfo(prev => (
			{
				...prev,
				stage: isLongBreak ? PomodoroStages.longBreak : PomodoroStages.shortBreak,
				state: isLongBreak ? PomodoroState.LongBreakRunning : PomodoroState.ShortBreakRunning
			}
		))
	}, [info.focusCount, countdown.restartCountdown, setInfo])

	return {
		...info,
		...focusTasksData,
		...countdown,
		relax,
		start,
		pause,
		finish,
	}
}