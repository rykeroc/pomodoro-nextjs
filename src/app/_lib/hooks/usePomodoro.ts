import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import PomodoroStages, {PomodoroStageInfo} from "@/app/_lib/constants/PomodoroStages";
import useFocusTasksData, {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import {FocusTask} from "@prisma/client";

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
		console.log(info)
	}, [info, focusTasksData.activeTask]);

	/*
	Update the total focus session seconds for the active task
	 */
	const updateActiveTask = useCallback(() => {
		console.log("updateActiveTask")
		if (!focusTasksData.activeTask) return
		const activeTask: FocusTask = focusTasksData.activeTask

		const elapsed = PomodoroStages.focusSession.seconds - countdown.remaining
		console.log(focusTasksData.activeTask,)
		console.log(countdown.remaining, elapsed)
		activeTask.totalFocusSeconds += elapsed
		const formData = Object.entries(activeTask).reduce((previousValue, [key, value]) => {
			previousValue.append(key, value as string)
			return previousValue
		}, new FormData())
		return focusTasksData.updateMutation.mutate(formData)
	}, [focusTasksData.activeTask, focusTasksData.updateMutation, countdown.remaining])

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
				updateActiveTask()
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
	}, [setInfo, updateActiveTask])

	// Set completion callback
	useEffect(() => {
		countdown.setOnCompleteAction(onCompleteAction)
	}, [countdown, onCompleteAction]);

	// Auto reset countdown if break was completed
	useEffect(() => {
		if (info.state === PomodoroState.FocusPending)
			countdown.resetCountdown(info.stage.seconds)
	}, [info.state, info.stage.seconds, countdown, countdown.resetCountdown]);

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
	}, [countdown, setInfo])

	const pause = useCallback(() => {
		countdown.pauseCountdown()
		// Update pomodoro state to paused
		setInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusPaused
			}
		))
	}, [countdown, setInfo])

	const finish = useCallback(() => {
		// Update the active task if focus session
		if (info.stage === PomodoroStages.focusSession)
			updateActiveTask()

		countdown.resetCountdown(PomodoroStages.focusSession.seconds)
		setInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusPending
			}
		))
	}, [info.stage, updateActiveTask, countdown, setInfo])

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
	}, [info.focusCount, countdown, setInfo])

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