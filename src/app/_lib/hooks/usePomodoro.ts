import {useCallback, useEffect, useState} from "react";
import PomodoroState from "@/app/_lib/constants/PomodoroState";
import PomodoroStages, {PomodoroStageInfo} from "@/app/_lib/constants/PomodoroStages";
import useFocusTasksData, {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import {FocusTask} from "@prisma/client";
import {IFocusTaskUpdateArgs} from "@/app/_lib/actions/focusTasks/types";
import useCountdown from "@/app/_lib/hooks/useCountdown";

interface PomodoroInfo {
	state: PomodoroState
	stage: PomodoroStageInfo
	focusCount: number
}

export interface IPomodoroTimer {
	focusCount: number
	remaining: number
	total: number
	stage: PomodoroStageInfo,
	state: PomodoroState,
	relax: () => void
	start: () => void
	pause: () => void
	resume: () => void
	finish: () => void
	skip: () => void
}

export interface IPomodoro extends IPomodoroTimer, IFocusTasksData {
}

export const PomodoroValues = {
	maxFocusCount: 4
}

export default function usePomodoro(userId: string): IPomodoro {
	const [pomodoroInfo, setPomodoroInfo] = useState<PomodoroInfo>({
		state: PomodoroState.FocusPending,
		stage: PomodoroStages.focusSession,
		focusCount: 0
	})

	const focusTasksData = useFocusTasksData(userId)

	const initialSeconds = PomodoroStages.focusSession.seconds; // initial time in milliseconds
	const {
		setOnCompleteAction,
		remaining,
		total,
		start,
		pause,
		resume,
		reset
	} = useCountdown(initialSeconds)

	/*
	Update the total focus session seconds for the active task
	 */
	const updateActiveTask = useCallback(() => {
		// Return if not active task
		if (!focusTasksData.activeTask) return

		console.log("updateActiveTask")
		const activeTask: FocusTask = focusTasksData.activeTask

		// Calculate elapsed time
		const elapsed = PomodoroStages.focusSession.seconds - remaining
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
	}, [focusTasksData.activeTask, focusTasksData.updateMutation, remaining, userId])

	const onFocusComplete = useCallback(() => {
		console.log("onFocusCompleted")

		updateActiveTask()
		setPomodoroInfo(prev => ({
			focusCount: prev.focusCount + 1,
			state: PomodoroState.FocusComplete,
			stage: PomodoroStages.focusSession
		}))
	}, [setPomodoroInfo, updateActiveTask])

	const onBreakComplete = useCallback(() => {
		console.log("onBreakComplete")

		setPomodoroInfo(prev => {
			reset(PomodoroStages.focusSession.seconds)

			return {
				...prev,
				state: PomodoroState.FocusPending,
				stage: PomodoroStages.focusSession
			}
		})
	}, [reset, setPomodoroInfo])

	const onCompleteAction = useCallback(() => {
		console.log("onCompleteAction")

		if (pomodoroInfo.state === PomodoroState.FocusRunning)
			onFocusComplete()
		else
			onBreakComplete()
	}, [pomodoroInfo.state, onFocusComplete, onBreakComplete])

	// Set completion callback
	useEffect(() => {
		setOnCompleteAction(onCompleteAction)
	}, [setOnCompleteAction, onCompleteAction]);

	// Start a focus session
	const startFocus = useCallback(() => {
		start(PomodoroStages.focusSession.seconds)
		// Update pomodoro state to running
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: PomodoroState.FocusRunning
			}
		))
	}, [start, setPomodoroInfo])

	// Pause the current focus session
	const pauseFocus = useCallback(() => {
		pause()
		// Update pomodoro state to paused
		setPomodoroInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusPaused
			}
		))
	}, [pause, setPomodoroInfo])

	// Pause the current focus session
	const resumeFocus = useCallback(() => {
		resume()
		// Update pomodoro state to paused
		setPomodoroInfo(prev => (
			{
				...prev,
				state: PomodoroState.FocusRunning
			}
		))
	}, [resume, setPomodoroInfo])

	// Finish a focus session early
	const finishFocus = useCallback(() => {
		// Update the active task if focus session
		if (pomodoroInfo.stage === PomodoroStages.focusSession)
			updateActiveTask()

		reset(PomodoroStages.focusSession.seconds)
		setPomodoroInfo(({
			focusCount: 0,
			stage: PomodoroStages.focusSession,
			state: PomodoroState.FocusPending
		}))
	}, [pomodoroInfo.stage, updateActiveTask, reset, setPomodoroInfo])

	// Start a break
	const startBreak = useCallback(() => {
		const isLongBreak = (pomodoroInfo.focusCount % PomodoroValues.maxFocusCount) === 0
		start(isLongBreak ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds)
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: isLongBreak ? PomodoroStages.longBreak : PomodoroStages.shortBreak,
				state: isLongBreak ? PomodoroState.LongBreakRunning : PomodoroState.ShortBreakRunning
			}
		))
	}, [pomodoroInfo.focusCount, start, setPomodoroInfo])

	const skipBreak = useCallback(() => {
		reset(PomodoroStages.focusSession.seconds)
		onBreakComplete()
	}, [reset, onBreakComplete])

	return {
		...pomodoroInfo,
		...focusTasksData,
		remaining,
		total,
		start: startFocus,
		pause: pauseFocus,
		resume: resumeFocus,
		finish: finishFocus,
		relax: startBreak,
		skip: skipBreak,
	}
}