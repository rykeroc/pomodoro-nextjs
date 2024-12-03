import {useCallback, useEffect, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState, {getNextState} from "@/app/_lib/enums/PomodoroState";
import {getNextStage, PomodoroStages} from "@/app/_lib/PomodoroStage";

export const getElapsedSeconds = (remaining: number, total: number): number => total - remaining

export default function usePomodoro() {
	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStages.focusSession)
	const [pomodoroState, setPomodoroState] = useState(PomodoroState.FocusPending)
	const [focusCount, setFocusCount] = useState(0)

	const {
		remainingSeconds,
		totalSeconds,
		getStatus,
		startCountdown,
		pauseCountdown,
		resetCountdown,
		setOnCompleteAction
	} = useCountdown(pomodoroStage.seconds)		// TODO: update default to pomodoroStage.getSeconds

	const updateState = useCallback(() => {
		const nextState = getNextState(
			pomodoroState, pomodoroStage, getStatus()
		)
		setPomodoroState(nextState)
	}, [
		pomodoroState, pomodoroStage,
		getStatus, setPomodoroState
	])

	// Set completion callback
	useEffect(() => {
		const completeCallback = () => {
			if (pomodoroStage === PomodoroStages.focusSession)
				setFocusCount(prev => prev + 1)
			console.log(`State: ${pomodoroState}, Status: ${getStatus()}`)
			updateState()
		}

		setOnCompleteAction(() => completeCallback)
	}, [
		pomodoroStage, pomodoroState, updateState,
		setOnCompleteAction, getStatus, setFocusCount
	]);

	const start = useCallback(() => {
		startCountdown()
		updateState()
		console.log(`State: ${pomodoroState}, Status: ${getStatus()}`)
	}, [
		updateState, pomodoroState,
		startCountdown, getStatus
	])

	const startNext = useCallback(() => {
		// TODO
		pauseCountdown()
		const nextStage = getNextStage(
			pomodoroStage,
			focusCount
		)
		setPomodoroStage(nextStage)
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
		pauseCountdown, setPomodoroStage, resetCountdown,
		startCountdown, getStatus, getNextState, setPomodoroState
	])

	const pause = useCallback(() => {
		pauseCountdown()
		updateState()
	}, [pauseCountdown, updateState])

	const finish = useCallback(() => {
		// TODO
		setPomodoroStage(PomodoroStages.focusSession)
		setPomodoroState(PomodoroState.FocusPending)
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