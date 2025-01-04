import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import PomodoroStages, {PomodoroStageInfo} from "@/app/_lib/constants/PomodoroStages";
import useFocusTasksData, {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import {FocusTask} from "@prisma/client";
import {IFocusTaskUpdateArgs} from "@/app/_lib/actions/focusTasks/types";

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

export interface IPomodoro extends IPomodoroTimer, IFocusTasksData {
}

export default function usePomodoro(userId: string): IPomodoro {
	const [pomodoroInfo, setPomodoroInfo] = useState<PomodoroInfo>({
		state: PomodoroState.FocusPending,
		stage: PomodoroStages.focusSession,
		focusCount: 0
	})

	const focusTasksData = useFocusTasksData(userId)

	const countdown = useCountdown(pomodoroInfo.stage.seconds)

	/*
	Update the total focus session seconds for the active task
	 */
	const updateActiveTask = useCallback(() => {
		// Return if not active task
		if (!focusTasksData.activeTask) return
		const activeTask: FocusTask = focusTasksData.activeTask

		// Calculate elapsed time
		const elapsed = PomodoroStages.focusSession.seconds - countdown.remaining
		activeTask.totalFocusSeconds += elapsed

		// Transform to FormData for mutate fn
		const formData = Object.entries(activeTask).reduce((previousValue, [key, value]) => {
			previousValue.append(key, value as string)
			return previousValue
		}, new FormData())

		const updateArgs: IFocusTaskUpdateArgs = {
			formData,
			userId
		}
		// Update the active task data
		return focusTasksData.updateMutation.mutate(updateArgs)
	}, [focusTasksData.activeTask, focusTasksData.updateMutation, countdown.remaining])

	/*
	 Called when the countdown completes.
	 */
	const onCompleteAction = useCallback(() => {
		/*
		 The countdown completes when in the following states:
		 - Focus running
		 - Short break running
		 - Long break running
		 */
		if (
			pomodoroInfo.state !== PomodoroState.FocusRunning &&
			pomodoroInfo.state !== PomodoroState.ShortBreakRunning &&
			pomodoroInfo.state !== PomodoroState.LongBreakRunning
		) return

		let newFocusCount = pomodoroInfo.focusCount
		// Update focus count if focus session was completed
		if (pomodoroInfo.state === PomodoroState.FocusRunning) {
			newFocusCount++
			updateActiveTask()
		}

		setPomodoroInfo(prev => {
			/*
			If previous state was running focus session, set state to Focus complete.

			If previous state was short or long break, set state to Focus Pending.
			 */
			const newState = prev.state === PomodoroState.FocusRunning ?
				PomodoroState.FocusComplete : PomodoroState.FocusPending

			// Next stage will always be focus session
			const newStage = PomodoroStages.focusSession

			return {
				focusCount: newFocusCount,
				state: newState,
				stage: newStage
			}
		})
	}, [pomodoroInfo.state, pomodoroInfo.focusCount, setPomodoroInfo, updateActiveTask])

	// Set completion callback
	useEffect(() => {
		countdown.setOnCompleteAction(onCompleteAction)
	}, [countdown, onCompleteAction]);

	// Auto reset countdown if break was completed
	useEffect(() => {
		if (pomodoroInfo.state === PomodoroState.FocusPending)
			countdown.resetCountdown(pomodoroInfo.stage.seconds)
	}, [pomodoroInfo.state, pomodoroInfo.stage.seconds, countdown, countdown.resetCountdown]);

	// Start a focus session
	const startFocus = useCallback(() => {
		countdown.startCountdown()
		// Update pomodoro state to running
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusRunning
			}
		))
	}, [countdown, setPomodoroInfo])

	// Pause the current focus session
	const pauseFocus = useCallback(() => {
		countdown.pauseCountdown()
		// Update pomodoro state to paused
		setPomodoroInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusPaused
			}
		))
	}, [countdown, setPomodoroInfo])

	// Finish a focus session early
	const finishFocus = useCallback(() => {
		// Update the active task if focus session
		if (pomodoroInfo.stage === PomodoroStages.focusSession)
			updateActiveTask()

		countdown.resetCountdown(PomodoroStages.focusSession.seconds)
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusPending
			}
		))
	}, [pomodoroInfo.stage, updateActiveTask, countdown, setPomodoroInfo])

	// Start a break
	const startBreak = useCallback(() => {
		const isLongBreak = (pomodoroInfo.focusCount % 4) === 0
		const seconds = isLongBreak ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds
		countdown.restartCountdown(seconds)
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: isLongBreak ? PomodoroStages.longBreak : PomodoroStages.shortBreak,
				state: isLongBreak ? PomodoroState.LongBreakRunning : PomodoroState.ShortBreakRunning
			}
		))
	}, [pomodoroInfo.focusCount, countdown, setPomodoroInfo])

	return {
		...pomodoroInfo,
		...focusTasksData,
		...countdown,
		relax: startBreak,
		start: startFocus,
		pause: pauseFocus,
		finish: finishFocus,
	}
}