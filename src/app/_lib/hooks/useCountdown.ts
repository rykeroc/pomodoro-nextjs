import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import CountdownStatus from "@/app/_lib/constants/CountdownStatus";

interface CounterInfo {
	remaining: number
	total: number
	status: CountdownStatus,
}

interface Countdown {
	remaining: number
	total: number
	status: CountdownStatus,
	setOnCompleteAction: Dispatch<SetStateAction<() => void>>
	startCountdown: () => void
	pauseCountdown: () => void
	resetCountdown: (newTotalSeconds: number) => void
	restartCountdown: (newTotalSeconds: number) => void
}

const intervalSpacingMs: number = 1000

export default function useCountdown(startingSeconds: number): Countdown {
	const [info, setInfo] = useState<CounterInfo>({
		total: startingSeconds,
		remaining: startingSeconds,
		status: CountdownStatus.NotStarted
	})
	const [onCompleteAction, setOnCompleteAction] = useState<() => void>(() => {})

	const intervalId = useRef<NodeJS.Timeout | null>(null)

	const onInterval = useCallback(() => {
		setInfo(prevState => (
			{
				...prevState,
				remaining: prevState.remaining - 1
			}
		))
	}, [setInfo])

	const start = useCallback(() => {
		// If already started or completed, do nothing
		{
			if (intervalId.current !== null) {
				console.log("Countdown already running.")
				return
			}

			if (info.remaining <= 0) {
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
		// Update status to running
		setInfo(prevState => (
			{
				...prevState,
				status: CountdownStatus.Running
			}
		))
	}, [intervalId.current, info.remaining,  onInterval])

	const pause = useCallback(() => {
		// If not started, paused, or complete, do nothing
		{
			if (!intervalId.current) {
				if (info.remaining === info.total) {
					console.log("Countdown has not started.")
					return
				} else if (info.remaining < info.total) {
					console.log("Countdown is already paused.")
					return
				} else if (info.remaining <= 0) {
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
		// Update state to paused
		setInfo(prevState => (
			{
				...prevState,
				status: CountdownStatus.Paused
			}
		))
	}, [intervalId, intervalId.current, info.remaining, info.total,])

	const reset = useCallback((newTotalSeconds: number) => {
		if (intervalId.current === null && info.remaining === info.total) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")
		pause()

		// Reset seconds and state
		setInfo({
			total: newTotalSeconds,
			remaining: newTotalSeconds,
			status: CountdownStatus.NotStarted,
		})
	}, [intervalId.current, info.remaining, info.total, pause, setInfo])

	const restart = useCallback((newTotalSeconds: number) => {
		console.log("Restarting countdown")

		// Reset seconds and state to running
		setInfo({
			total: newTotalSeconds,
			remaining: newTotalSeconds,
			status: CountdownStatus.Running
		})

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
		setInfo,
	])

	// Check if countdown is complete
	useEffect(() => {
		if (info.remaining <= 0) {
			pause()
			// Set state to complete
			setInfo(prevState => (
				{
					...prevState,
					status: CountdownStatus.Complete
				}
			))
			if (onCompleteAction) onCompleteAction()
		}
	}, [info.remaining]);

	return {
		setOnCompleteAction,
		status: info.status,
		remaining: info.remaining,
		total: info.total,
		startCountdown: start,
		pauseCountdown: pause,
		resetCountdown: reset,
		restartCountdown: restart
	}
}