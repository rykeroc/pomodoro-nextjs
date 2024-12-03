import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import CountdownStatus from "@/app/_lib/enums/CountdownStatus";

interface CounterSeconds {
	total: number
	remaining: number
}

interface Countdown {
	status: CountdownStatus,
	seconds: CounterSeconds
	setOnCompleteAction: Dispatch<SetStateAction<() => void>>
	startCountdown: () => void
	pauseCountdown: () => void
	resetCountdown: (newTotalSeconds: number) => void
	restartCountdown: (newTotalSeconds: number) => void
}

const intervalSpacingMs: number = 1000

export default function useCountdown(startingSeconds: number): Countdown {
	const [seconds, setSeconds] = useState<CounterSeconds>({
		total: startingSeconds,
		remaining: startingSeconds
	})
	const [status, setStatus] = useState(CountdownStatus.NotStarted)
	const [onCompleteAction, setOnCompleteAction] = useState<() => void>(() => {})

	const intervalId = useRef<NodeJS.Timeout | null>(null)

	const onInterval = useCallback(() => {
		setSeconds(prevState => (
			{
				...prevState,
				remaining: prevState.remaining - 1
			}
		))
	}, [setSeconds])

	const start = useCallback(() => {
		// If already started or completed, do nothing
		{
			if (intervalId.current !== null) {
				console.log("Countdown already running.")
				return
			}

			if (seconds.remaining <= 0) {
				console.log("Countdown has been completed.")
				return
			}
		}

		console.log("Starting countdown")
		// Start countdown by setting interval
		intervalId.current = setInterval(
			onInterval,
			intervalSpacingMs
		)
		setStatus(CountdownStatus.Running)
	}, [intervalId.current, seconds.remaining,  onInterval])

	const pause = useCallback(() => {
		// If not started, paused, or complete, do nothing
		{
			if (!intervalId.current) {
				if (seconds.remaining === seconds.total) {
					console.log("Countdown has not started.")
					return
				} else if (seconds.remaining < seconds.total) {
					console.log("Countdown is already paused.")
					return
				} else if (seconds.remaining <= 0) {
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
	}, [intervalId, intervalId.current, seconds.remaining, seconds.total,])

	const reset = useCallback((newTotalSeconds: number) => {
		if (intervalId.current === null && seconds.remaining === seconds.total) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")
		pause()

		// Reset seconds
		setSeconds({
			total: newTotalSeconds,
			remaining: newTotalSeconds
		})
		setStatus(CountdownStatus.NotStarted)
	}, [intervalId.current, seconds.remaining, seconds.total, pause, setSeconds])

	const restart = useCallback((newTotalSeconds: number) => {
		console.log("Restarting countdown")

		// Reset seconds
		setSeconds({
			total: newTotalSeconds,
			remaining: newTotalSeconds
		})
		setStatus(CountdownStatus.Running)

		// Explicitly clear any existing interval
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}

		intervalId.current = setInterval(
			onInterval,
			intervalSpacingMs
		)
	}, [
		intervalId.current, start, onInterval,
		setSeconds, setStatus,
	])

	// Check if countdown is complete
	useEffect(() => {
		if (seconds.remaining <= 0) {
			pause()
			setStatus(CountdownStatus.Complete)
			if (onCompleteAction) onCompleteAction()
		}
	}, [seconds.remaining]);

	return {
		status,
		seconds,
		setOnCompleteAction,
		startCountdown: start,
		pauseCountdown: pause,
		resetCountdown: reset,
		restartCountdown: restart
	}
}