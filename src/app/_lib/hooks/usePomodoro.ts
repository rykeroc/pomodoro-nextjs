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
		startCountdown,
		pauseCountdown,
		resetCountdown,
		remainingSeconds,
		setRemainingSeconds,
		totalSeconds,
		setTotalSeconds,
		setOnIntervalAction,
		setOnCompleteAction
	} = useCountdown(5)		// TODO: update default to pomodoroStage.getSeconds

	// Set completion callback
	useEffect(() => {
		const completeCallback = () => {
			console.log("Countdown complete")
		}

		setOnCompleteAction(() => completeCallback)
	}, [setOnCompleteAction]);

	const start = useCallback(() => {
		// TODO
		startCountdown()
	}, [startCountdown])

	const pause = useCallback(() => {
		// TODO
		pauseCountdown()
	}, [pauseCountdown])

	const finish = useCallback(() => {
		// TODO
		// Todo: get next duration
		resetCountdown()
		setPomodoroStage(PomodoroStage.focusSession)
		setTotalSeconds(pomodoroStage.getSeconds())
	}, [
		resetCountdown,
		setPomodoroStage, setTotalSeconds
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