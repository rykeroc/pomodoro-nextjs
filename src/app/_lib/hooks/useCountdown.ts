import {useCallback, useRef, useState} from "react";
import CountdownStatus from "@/app/_lib/enums/CountdownStatus";

export default function useCountdown(seconds: number) {
	const [totalSeconds, setTotalSeconds] = useState(seconds)
	const [remainingSeconds, setRemainingSeconds] = useState(seconds)
	const [status, setStatus] = useState(CountdownStatus.NotStarted)
	const intervalSpacingMs: number = 1000

	let intervalId = useRef<NodeJS.Timeout | null>(null)

	const [onComplete, setOnComplete] = useState<() => void>(() => {})
	const [onInterval, setOnInterval] = useState<(remainingSeconds: number) => void>((_) => {})

	const clearCurrentInterval = useCallback(() => {
		// Clear any running interval
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
	}, [])

	const intervalFunction = useCallback(() => {
		// Update remaining seconds
		setRemainingSeconds((prev) => {
			const nextSeconds = prev - 1

			if (onInterval)
				onInterval(nextSeconds)

			// Check if timer is complete
			if (nextSeconds <= 0) {
				clearCurrentInterval()

				setStatus(CountdownStatus.Complete)
				if (onComplete)
					// Call on complete callback
					onComplete()

				return 0
			}

			return nextSeconds
		})
	}, [])

	const start = useCallback(() => {
		// If already started or completed, do nothing
		if (status === CountdownStatus.Running) {
			console.log("Countdown already running.")
			return
		}

		if (status === CountdownStatus.Complete) {
			console.log("Countdown has been completed.")
			return
		}

		console.log("Starting countdown")

		intervalId.current = setInterval(
			intervalFunction,
			intervalSpacingMs
		)

		setStatus(CountdownStatus.Running)
	}, [status, clearCurrentInterval, intervalFunction])

	const pause = useCallback(() => {
		// If not started, paused, or complete, do nothing
		if (status === CountdownStatus.NotStarted) {
			console.log("Countdown has not started.")
			return
		}

		if (status === CountdownStatus.Paused) {
			console.log("Countdown is paused.")
			return
		}

		if (status === CountdownStatus.Complete) {
			console.log("Countdown has been completed.")
			return
		}

		console.log("Pausing countdown")

		clearCurrentInterval()

		setStatus(CountdownStatus.Paused)
	}, [status, clearCurrentInterval])

	const reset = useCallback(() => {
		if (status === CountdownStatus.NotStarted) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")

		clearCurrentInterval()

		// Reset seconds
		setRemainingSeconds(totalSeconds)
		setStatus(CountdownStatus.NotStarted)
	}, [status, totalSeconds])

	return {
		remainingSeconds,
		setRemainingSeconds,
		totalSeconds,
		setTotalSeconds,
		status,
		setOnInterval,
		setOnComplete,
		start,
		pause,
		reset
	}
}