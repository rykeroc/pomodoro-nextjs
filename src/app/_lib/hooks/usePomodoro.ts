import {useCallback, useEffect, useState} from "react";
import PomodoroStage from "@/app/_lib/PomodoroStage";
import useCountdown from "@/app/_lib/hooks/useCountdown";

export function getNextStage(currentStage: PomodoroStage, focusSessionCount: number): PomodoroStage {
	if (currentStage === PomodoroStage.focusSession && focusSessionCount % 4 > 0)
		return PomodoroStage.shortBreak
	else if (currentStage === PomodoroStage.focusSession && focusSessionCount % 4 === 0)
		return PomodoroStage.longBreak
	else
		return PomodoroStage.focusSession
}

export default function usePomodoro() {
	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStage.focusSession)
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
	} = useCountdown(5)		// TODO: update default to pomodoroStage.getSeconds

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
		console.log(getStatus())
	}, [startCountdown])

	const pause = useCallback(() => {
		// TODO
		pauseCountdown()
		console.log(getStatus())
	}, [pauseCountdown])

	const finish = useCallback(() => {
		// TODO
		setPomodoroStage(PomodoroStage.focusSession)
		resetCountdown(pomodoroStage.getSeconds())
		console.log(getStatus())
	}, [
		pomodoroStage,
		setPomodoroStage, resetCountdown, getStatus,
	])

	return {
		remainingSeconds,
		totalSeconds,
		pomodoroStage,
		startPomodoro: start,
		pausePomodoro: pause,
		finishPomodoro: finish,
	}
}