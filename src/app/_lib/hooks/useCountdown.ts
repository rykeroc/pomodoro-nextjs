import {useCallback, useRef, useState} from "react";

export default function useCountdown(seconds: number) {
	const [totalSeconds, setTotalSeconds] = useState(seconds)
	const [remainingSeconds, setRemainingSeconds] = useState(seconds)
	const [onComplete, setOnComplete] = useState<() => void>(() => {})
	const [onInterval, setOnInterval] = useState<(remainingSeconds: number) => void>((_) => {})
	const intervalId = useRef<NodeJS.Timeout | null>(null)

	const intervalSpacingMs: number = 1000

	const clearCurrentInterval = useCallback(() => {
		// Clear any running interval
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
	}, [intervalId])

	const intervalFunction = useCallback(() => {
		// Update remaining seconds
		setRemainingSeconds((prev) => {
			const nextSeconds = prev - 1

			// Check if timer is complete
			if (nextSeconds <= 0) {
				clearCurrentInterval()
				if (onComplete) onComplete()
				return 0
			}

			if (onInterval) onInterval(nextSeconds)
			return nextSeconds
		})
	}, [clearCurrentInterval, onComplete, onInterval])

	// Countdown start
	const start = useCallback(() => {
		// If already started or completed, do nothing
		if (intervalId.current !== null) {
			console.log("Countdown already running.")
			return
		}

		if (remainingSeconds <= 0) {
			console.log("Countdown has been completed.")
			return
		}

		console.log("Starting countdown")

		intervalId.current = setInterval(
			intervalFunction,
			intervalSpacingMs
		)

	}, [intervalId, remainingSeconds, clearCurrentInterval, intervalFunction])

	// Countdown pause
	const pause = useCallback(() => {
		// If not started, paused, or complete, do nothing
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

		console.log("Pausing countdown")

		clearCurrentInterval()
	}, [
		intervalId, remainingSeconds, totalSeconds, clearCurrentInterval
	])

	// Countdown reset
	const reset = useCallback(() => {
		if (intervalId.current === null && remainingSeconds === totalSeconds) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")

		clearCurrentInterval()

		// Reset seconds
		setRemainingSeconds(totalSeconds)
	}, [
		intervalId, remainingSeconds, totalSeconds, clearCurrentInterval
	])

	return {
		remainingSeconds,
		setRemainingSeconds,
		totalSeconds,
		setTotalSeconds,
		setOnInterval,
		setOnComplete,
		start,
		pause,
		reset
	}
}