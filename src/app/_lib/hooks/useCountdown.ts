import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import CountdownStatus from "@/app/_lib/enums/CountdownStatus";

interface Countdown {
	status: CountdownStatus,
	remainingSeconds: number
	totalSeconds: number
	setOnCompleteAction: Dispatch<SetStateAction<() => void>>
	startCountdown: () => void
	pauseCountdown: () => void
	resetCountdown: (newTotalSeconds: number) => void
}

const intervalSpacingMs: number = 1000

export default function useCountdown(seconds: number): Countdown {
	const [totalSeconds, setTotalSeconds] = useState(seconds)
	const [remainingSeconds, setRemainingSeconds] = useState(seconds)
	const [status, setStatus] = useState(CountdownStatus.NotStarted)
	const [onCompleteAction, setOnCompleteAction] = useState<() => void>(() => {})

	const intervalId = useRef<NodeJS.Timeout | null>(null)

	const start = useCallback(() => {
		// If already started or completed, do nothing
		{
			if (intervalId.current !== null) {
				console.log("Countdown already running.")
				return
			}

			if (remainingSeconds <= 0) {
				console.log("Countdown has been completed.")
				return
			}
		}

		console.log("Starting countdown")
		// Start countdown by setting interval
		intervalId.current = setInterval(
			() => setRemainingSeconds(prev => prev - 1),
			intervalSpacingMs
		)
		setStatus(CountdownStatus.Running)
	}, [intervalId.current, remainingSeconds])

	const pause = useCallback(() => {
		// If not started, paused, or complete, do nothing
		{
			if (!intervalId.current) {
				if (remainingSeconds === totalSeconds) {
					console.log("Countdown has not started.")
					return
				} else if (remainingSeconds < totalSeconds) {
					console.log("Countdown is already paused.")
					return
				} else if (remainingSeconds <= 0) {
					console.log("Countdown has been completed.")
					return
				}
			}
		}

		console.log("Pausing countdown")

		// Pause timer by clearing interval
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
		setStatus(CountdownStatus.Paused)
	}, [intervalId, intervalId.current, remainingSeconds, totalSeconds,])

	const reset = useCallback((newTotalSeconds: number) => {
		if (intervalId.current === null && remainingSeconds === totalSeconds) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")
		pause()

		// Reset seconds
		setTotalSeconds(newTotalSeconds)
		setRemainingSeconds(newTotalSeconds)
		setStatus(CountdownStatus.NotStarted)
	}, [intervalId.current, remainingSeconds, totalSeconds, pause])

	useEffect(() => {
		console.log(`Status: ${status}`)
	}, [status]);

	// Check if countdown is complete
	useEffect(() => {
		if (remainingSeconds <= 0) {
			pause()
			setStatus(CountdownStatus.Complete)
			if (onCompleteAction) onCompleteAction()
		}
	}, [remainingSeconds]);

	return {
		status,
		remainingSeconds,
		totalSeconds,
		setOnCompleteAction,
		startCountdown: start,
		pauseCountdown: pause,
		resetCountdown: reset
	}
}