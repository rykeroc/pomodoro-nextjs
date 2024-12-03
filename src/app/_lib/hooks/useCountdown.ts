import {Dispatch, SetStateAction, useCallback, useRef, useState} from "react";
import CountdownStatus from "@/app/_lib/enums/CountdownStatus";

interface Countdown {
	getStatus: () => CountdownStatus,
	remainingSeconds: number
	totalSeconds: number
	setOnCompleteAction: Dispatch<SetStateAction<() => void>>
	startCountdown: () => void
	pauseCountdown: () => void
	resetCountdown: (newTotalSeconds: number) => void
}

export default function useCountdown(seconds: number): Countdown {
	const [totalSeconds, setTotalSeconds] = useState(seconds)
	const [remainingSeconds, setRemainingSeconds] = useState(seconds)
	const [onCompleteAction, setOnCompleteAction] = useState<() => void>(() => {})
	const intervalId = useRef<NodeJS.Timeout | null>(null)

	const intervalSpacingMs: number = 1000

	const getStatus = useCallback(() => {
		if (intervalId.current === null) {
			if (remainingSeconds === 0)
				return CountdownStatus.Complete
			else if (remainingSeconds === totalSeconds)
				return CountdownStatus.NotStarted
			else if (remainingSeconds < totalSeconds)
				return CountdownStatus.Paused
		}

		return CountdownStatus.Running
	}, [
		intervalId, remainingSeconds, totalSeconds
	])

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
			if (nextSeconds <= 0 && intervalId.current) {
				clearCurrentInterval()
				if (onCompleteAction) onCompleteAction()
				return 0
			}

			return nextSeconds
		})
	}, [clearCurrentInterval, onCompleteAction])

	// Countdown start
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

		intervalId.current = setInterval(
			intervalFunction,
			intervalSpacingMs
		)
	}, [
		intervalId, remainingSeconds,
		clearCurrentInterval, intervalFunction,
	])

	// Countdown pause
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

		clearCurrentInterval()
	}, [
		intervalId, remainingSeconds, totalSeconds,
		clearCurrentInterval,
	])

	// Countdown reset
	const reset = useCallback((newTotalSeconds: number) => {
		if (intervalId.current === null && remainingSeconds === totalSeconds) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")

		clearCurrentInterval()

		// Reset seconds
		setTotalSeconds(newTotalSeconds)
		setRemainingSeconds(newTotalSeconds)
	}, [
		intervalId, remainingSeconds, totalSeconds,
		clearCurrentInterval,
		setTotalSeconds, setRemainingSeconds
	])

	return {
		getStatus,
		remainingSeconds,
		totalSeconds,
		setOnCompleteAction,
		startCountdown: start,
		pauseCountdown: pause,
		resetCountdown: reset
	}
}