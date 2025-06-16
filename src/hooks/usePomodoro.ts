import {useCallback, useEffect, useState} from "react";
import useFocusTasksData, {IFocusTasksData} from "@/hooks/useFocusTasksData";
import {FocusTask} from "@prisma/client";
import {IFocusTaskUpdateArgs} from "@/lib/actions/focus-tasks/types";
import useCountdown, {ECountdownStatus} from "@/hooks/useCountdown";
import {IUseDocumentTitle, useDocumentTitle} from "@/hooks/useDocumentTitle";
import {secondsToMinutes} from "@/lib/dateTimeHelpers";

type PomodoroStage = "focusSession" | "shortBreak" | "longBreak"

interface IPomodoroStageInfo {
	name: string
	seconds: number
}

enum EPomodoroState {
	FocusPending = "Focus Pending",
	FocusRunning = "Focus Running",
	FocusPaused = "Focus Paused",
	FocusComplete = "Focus Complete",
	ShortBreakRunning = "Short Break Running",
	LongBreakRunning = "Long Break Running",
}

const PomodoroStages: { [key in PomodoroStage]: IPomodoroStageInfo } = {
	focusSession: {
		name: 'Focus',
		seconds: 25 * 60
	},
	shortBreak: {
		name: 'Short Break',
		seconds: 5 * 60
	},
	longBreak: {
		name: 'Long Break',
		seconds: 15 * 60
	},
}

interface IPomodoroInfo {
	state: EPomodoroState
	stage: IPomodoroStageInfo
	focusCount: number
}

interface IPomodoroTimer {
	focusCount: number
	remaining: number
	total: number
	stage: IPomodoroStageInfo,
	state: EPomodoroState,
	relax: () => void
	start: () => void
	pause: () => void
	resume: () => void
	finish: () => void
	skip: () => void
}

interface IPomodoro extends IPomodoroTimer, IFocusTasksData {
}

const PomodoroValues = {
	maxFocusCount: 4
}

function usePomodoro(userId: string): IPomodoro {
	const [pomodoroInfo, setPomodoroInfo] = useState<IPomodoroInfo>({
		state: EPomodoroState.FocusPending,
		stage: PomodoroStages.focusSession,
		focusCount: 0
	})

	const focusTasksData = useFocusTasksData(userId)

	const initialSeconds = PomodoroStages.focusSession.seconds; // initial time in milliseconds
	const countdown = useCountdown(initialSeconds)

	const documentTitle: IUseDocumentTitle = useDocumentTitle()

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
	}, [focusTasksData.activeTask, focusTasksData.updateMutation, countdown, userId])

	const onFocusComplete = useCallback(() => {
		console.log("onFocusCompleted")

		updateActiveTask()
		setPomodoroInfo(prev => ({
			focusCount: prev.focusCount + 1,
			state: EPomodoroState.FocusComplete,
			stage: PomodoroStages.focusSession
		}))
	}, [setPomodoroInfo, updateActiveTask])

	const onBreakComplete = useCallback(() => {
		console.log("onBreakComplete")

		setPomodoroInfo(prev => {
			countdown.reset(PomodoroStages.focusSession.seconds)

			return {
				...prev,
				state: EPomodoroState.FocusPending,
				stage: PomodoroStages.focusSession
			}
		})
	}, [countdown, setPomodoroInfo])

	const onCompleteAction = useCallback(() => {
		console.log("onCompleteAction")

		if (pomodoroInfo.state === EPomodoroState.FocusRunning)
			onFocusComplete()
		else
			onBreakComplete()
	}, [pomodoroInfo.state, onFocusComplete, onBreakComplete])

	// Set completion callback
	useEffect(() => {
		countdown.setOnCompleteAction(onCompleteAction)
	}, [countdown, onCompleteAction]);

	// Start a focus session
	const startFocus = useCallback(() => {
		countdown.start(PomodoroStages.focusSession.seconds)
		// Update PomodoroComponents state to running
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: PomodoroStages.focusSession,
				state: EPomodoroState.FocusRunning
			}
		))
	}, [countdown, setPomodoroInfo])

	// Pause the current focus session
	const pauseFocus = useCallback(() => {
		countdown.pause()
		// Update PomodoroComponents state to paused
		setPomodoroInfo(prev => (
			{
				...prev,
				state: EPomodoroState.FocusPaused
			}
		))
	}, [countdown, setPomodoroInfo])

	// Pause the current focus session
	const resumeFocus = useCallback(() => {
		countdown.resume()
		// Update PomodoroComponents state to paused
		setPomodoroInfo(prev => (
			{
				...prev,
				state: EPomodoroState.FocusRunning
			}
		))
	}, [countdown, setPomodoroInfo])

	// Finish a focus session early
	const finishFocus = useCallback(() => {
		// Update the active task if focus session
		if (pomodoroInfo.stage === PomodoroStages.focusSession) {
			updateActiveTask()
		}

		countdown.reset(PomodoroStages.focusSession.seconds)
		setPomodoroInfo(({
			focusCount: 0,
			stage: PomodoroStages.focusSession,
			state: EPomodoroState.FocusPending
		}))
	}, [pomodoroInfo.stage, updateActiveTask, countdown, setPomodoroInfo])

	// Start a break
	const startBreak = useCallback(() => {
		const isLongBreak = (pomodoroInfo.focusCount % PomodoroValues.maxFocusCount) === 0
		countdown.start(isLongBreak ? PomodoroStages.longBreak.seconds : PomodoroStages.shortBreak.seconds)
		setPomodoroInfo(prev => (
			{
				...prev,
				stage: isLongBreak ? PomodoroStages.longBreak : PomodoroStages.shortBreak,
				state: isLongBreak ? EPomodoroState.LongBreakRunning : EPomodoroState.ShortBreakRunning
			}
		))
	}, [pomodoroInfo.focusCount, countdown, setPomodoroInfo])

	const skipBreak = useCallback(() => {
		countdown.reset(PomodoroStages.focusSession.seconds)
		onBreakComplete()
	}, [countdown, onBreakComplete])

	const getTitle = useCallback((): string | null => {
		if (countdown.status !== ECountdownStatus.Running || countdown.remaining <= 0) return null
		const minutesString = secondsToMinutes(countdown.remaining)
		return `${pomodoroInfo.stage.name} - ${minutesString}`
	}, [pomodoroInfo.stage, countdown])

	// Append remaining time to title if countdown is running
	useEffect(() => {
		const newTitle: string | null = getTitle()
		documentTitle.setTitle(newTitle)
	}, [getTitle, documentTitle]);

	return {
		...pomodoroInfo,
		...focusTasksData,
		...countdown,
		start: startFocus,
		pause: pauseFocus,
		resume: resumeFocus,
		finish: finishFocus,
		relax: startBreak,
		skip: skipBreak,
	}
}

export default usePomodoro

export {
	PomodoroStages,
	EPomodoroState,
	PomodoroValues
}

export type {
	IPomodoroStageInfo,
	IPomodoroTimer,
	IPomodoro
}
