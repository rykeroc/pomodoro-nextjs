import {useCallback, useEffect, useState} from "react";
import PomodoroStage from "@/app/_lib/PomodoroStage";
import useCountdown from "@/app/_lib/hooks/useCountdown";

export default function usePomodoro() {
	const [pomodoroStage, setPomodoroStage] = useState(PomodoroStage.focusSession)

	const {
		start,
		pause,
		reset,
		remainingSeconds,
		setRemainingSeconds,
		totalSeconds,
		setTotalSeconds,
		setOnInterval,
		setOnComplete
	} = useCountdown(5)		// TODO: update default to pomodoroStage.getSeconds

	// Set completion callback
	useEffect(() => {
		const completeCallback = () => {
			console.log("Countdown complete")
		}

		setOnComplete(() => completeCallback)
	}, [setOnComplete]);

	const startPomodoro = useCallback(() => {
		// TODO
		start()
	}, [start])

	const pausePomodoro = useCallback(() => {
		// TODO
		pause()
	}, [pause])

	const finishPomodoro = useCallback(() => {
		// TODO
		// Todo: get next duration
		reset()
		// setPomodoroStage(PomodoroStage.focusSession)
		// setTotalSeconds(pomodoroStage.getSeconds())
	}, [
		reset,
		setPomodoroStage, setTotalSeconds
	])

	return {
		remainingSeconds,
		totalSeconds,
		pomodoroStage,
		startPomodoro,
		pausePomodoro,
		finishPomodoro,
	}
}