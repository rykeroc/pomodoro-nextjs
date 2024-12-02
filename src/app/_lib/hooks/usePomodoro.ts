import {useCallback, useEffect, useState} from "react";
import PomodoroStage from "@/app/_lib/PomodoroStage";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState from "@/app/_lib/enums/PomodoroState";
import CountdownStatus from "@/app/_lib/enums/CountdownStatus";

export function getNextStage(currentStage: PomodoroStage, focusCount: number): PomodoroStage {
	console.log(`Focus Count: ${focusCount}`)
	if (currentStage === PomodoroStage.focusSession && focusCount % 4 > 0)
		return PomodoroStage.shortBreak

	if (currentStage === PomodoroStage.focusSession && focusCount % 4 === 0)
		return PomodoroStage.longBreak

	return PomodoroStage.focusSession
}

function getNextState(state: PomodoroState, stage: PomodoroStage, status: CountdownStatus): PomodoroState {
	const states = {
		isFocusPending: state === PomodoroState.FocusPending,
		isFocusRunning: state === PomodoroState.FocusRunning,
		isFocusComplete: state === PomodoroState.FocusComplete,
		isFocusPaused: state === PomodoroState.FocusPaused,
		isShortBreakRunning: state === PomodoroState.ShortBreakRunning,
		isLongBreakRunning: state === PomodoroState.LongBreakRunning
	}

	const stages = {
		isFocusSession: stage === PomodoroStage.focusSession,
		isShortBreak: stage === PomodoroStage.shortBreak,
		isLongBreak: stage === PomodoroStage.longBreak
	}

	const statuses = {
		isNotStarted: status === CountdownStatus.NotStarted,
		isRunning: status === CountdownStatus.Running,
		isPaused: status === CountdownStatus.Paused,
		isComplete: status === CountdownStatus.Complete
	}

	/*
	Focus Running if current state is focus pending or paused AND
	status is running
	 */
	if (
		states.isFocusPending || states.isFocusPaused &&
		statuses.isRunning
	) return PomodoroState.FocusRunning

	/*
	Focus Paused if current state is focus running AND
	status is paused
	 */
	else if (
		states.isFocusRunning &&
		statuses.isPaused
	) return PomodoroState.FocusPaused

	/*
	Focus Complete if current state is focus running AND
	status is complete
	 */
	else if (
		states.isFocusRunning &&
		statuses.isComplete
	) return PomodoroState.FocusComplete

	/*
	Short break running if current state is focus complete AND
	current stage is short break AND
	status is running
	 */
	else if (
		states.isFocusComplete &&
		stages.isShortBreak &&
		statuses.isRunning
	) return PomodoroState.ShortBreakRunning

	/*
	Long break running if current state is focus complete AND
	current stage is long break AND
	status is running
	 */
	else if (
		states.isFocusComplete &&
		stages.isLongBreak &&
		statuses.isRunning
	) return PomodoroState.LongBreakRunning

	/*
	Focus Pending (Not started) if current state is focus paused AND
	status is not started
	 */
	return PomodoroState.FocusPending
}

export const getElapsedSeconds = (remaining: number, total: number): number => total - remaining

export default function usePomodoro() {
	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStage.focusSession)
	const [pomodoroState, setPomodoroState] = useState(PomodoroState.FocusPending)
	const [focusCount, setFocusCount] = useState(0)

	const {
		remainingSeconds,
		totalSeconds,
		getStatus,
		startCountdown,
		pauseCountdown,
		resetCountdown,
		setOnIntervalAction,
		setOnCompleteAction
	} = useCountdown(pomodoroStage.seconds)		// TODO: update default to pomodoroStage.getSeconds

	// Set completion callback
	useEffect(() => {
		const completeCallback = () => {
			console.log(getStatus())
		}

		setOnCompleteAction(() => completeCallback)
	}, [setOnCompleteAction, getStatus]);

	const start = useCallback(() => {
		// TODO
		startCountdown()
	}, [startCountdown])

	const startNext = useCallback(() => {
		// TODO
		pauseCountdown()
		const nextStage = getNextStage(
			pomodoroStage,
			focusCount
		)
		setPomodoroStage(nextStage)
		console.log(`Next stage: ${nextStage.name}, Seconds: ${nextStage.seconds}`)
		resetCountdown(nextStage.seconds)
		startCountdown()

		const countDownStatus = getStatus()
		const nextState = getNextState(
			pomodoroState,
			nextStage,
			countDownStatus
		)
		setPomodoroState(nextState)
	}, [
		pomodoroStage, focusCount,
		pauseCountdown, getNextStage, setPomodoroStage, resetCountdown,
		startCountdown, getStatus, getNextState, setPomodoroState
	])

	const pause = useCallback(() => {
		// TODO
		pauseCountdown()
	}, [pauseCountdown])

	const finish = useCallback(() => {
		// TODO
		setPomodoroStage(PomodoroStage.focusSession)
		resetCountdown(pomodoroStage.seconds)
	}, [
		pomodoroStage,
		setPomodoroStage, resetCountdown, getStatus,
	])

	return {
		remainingSeconds,
		totalSeconds,
		pomodoroStage,
		pomodoroState,
		startNext,
		startPomodoro: start,
		pausePomodoro: pause,
		finishPomodoro: finish,
	}
}