import {useCallback, useEffect, useRef, useState} from "react";
import useCountdown from "@/app/_lib/hooks/useCountdown";
import PomodoroState, {getNextState} from "@/app/_lib/enums/PomodoroState";
import {getStageFromState, PomodoroStages} from "@/app/_lib/PomodoroStage";

export const elapsedSeconds = (remaining: number, total: number): number => total - remaining

export default function usePomodoro() {
	const [pomodoroState, setPomodoroState] = useState(PomodoroState.FocusPending)
	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStages.focusSession)
	const [focusCount, setFocusCount] = useState(0)
	const isFirstRender = useRef(true);

	// Keep pomodoro stage up to date
	useEffect(() => {
		const stage = getStageFromState(pomodoroState)
		setPomodoroStage(stage)
	}, [pomodoroState]);

	const {
		remainingSeconds, totalSeconds, status,
		startCountdown, pauseCountdown, resetCountdown,
		setOnCompleteAction
	} = useCountdown(pomodoroStage.seconds)

	// Set completion callback
	useEffect(() => {
		setOnCompleteAction(() => {
			function completeAction() {
				if (pomodoroStage === PomodoroStages.focusSession)
					setFocusCount(prev => prev + 1)
				console.log("Completed stage")
			}

			return completeAction
		})
	}, []);

	const start = useCallback(() => {
		startCountdown()
	}, [startCountdown])

	const pause = useCallback(() => {
		pauseCountdown()
	}, [pauseCountdown])

	const finish = useCallback(() => {
		setPomodoroState(PomodoroState.FocusPending)
		resetCountdown(pomodoroStage.seconds)
	}, [setPomodoroState, resetCountdown, pomodoroStage])

	// Update state when status changes
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}
		setPomodoroState(prev => {
			return getNextState(
				prev, status, focusCount
			)
		})
	}, [status, focusCount]);

	// TODO: Debugging state and status
	useEffect(() => {
		console.log(`State: ${pomodoroState}, Status: ${status}`)
	}, [status, pomodoroState]);


	const startNext = useCallback(() => {
		// TODO
		pauseCountdown()

		resetCountdown(pomodoroStage.seconds)
		startCountdown()
	}, [
		pomodoroStage, focusCount, pomodoroState,
		pauseCountdown,
		startCountdown, getNextState, setPomodoroState
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