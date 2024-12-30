import {useCallback, useEffect, useRef, useState} from "react";
import CountdownStatus from "@/app/_lib/constants/CountdownStatus";

interface CounterInfo {
	remaining: number
	total: number
	status: CountdownStatus,
}

export interface ICountdown {
	remaining: number
	total: number
	status: CountdownStatus,
	setOnCompleteAction: (callback: () => void) => void
	startCountdown: () => void
	pauseCountdown: () => void
	resetCountdown: (newTotalSeconds: number) => void
	restartCountdown: (newTotalSeconds: number) => void
}

const intervalSpacingMs: number = 1000

export default function useCountdown(startingSeconds: number): ICountdown {
	const [info, setInfo] = useState<CounterInfo>({
		total: startingSeconds,
		remaining: startingSeconds,
		status: CountdownStatus.NotStarted
	})
	const onCompleteActionRef = useRef<(() => void) | null>(null);
	const setOnCompleteAction = useCallback((callback: () => void) => {
		onCompleteActionRef.current = callback;
	}, []);

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
	}, [info.remaining, onInterval])

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
	}, [intervalId, info.remaining, info.total,])

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
	}, [info.remaining, info.total, pause, setInfo])

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
		onInterval,
		setInfo,
	])

	// Check if countdown is complete
	useEffect(() => {
		if (info.remaining <= 0 && info.status === CountdownStatus.Running) {
			pause()
			// Set state to complete
			setInfo(prevState => {
				if (onCompleteActionRef.current) onCompleteActionRef.current()

				return {
					...prevState,
					status: CountdownStatus.Complete
				}
			})
		}
	}, [info.remaining, info.status, pause]);

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