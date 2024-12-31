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

export default function useCountdown(startingSeconds: number): ICountdown {
	// Internal timer information
	const [info, setInfo] = useState<CounterInfo>({
		total: startingSeconds,
		remaining: startingSeconds,
		status: CountdownStatus.NotStarted
	})

	// Function to execute when the countdown is completed
	const onCompleteActionRef = useRef<(() => void) | null>(null);
	// Setter for onCompleteActionRef
	const setOnCompleteAction = useCallback((callback: () => void) => {
		onCompleteActionRef.current = callback;
	}, []);

	// ID of the current interval
	const intervalId = useRef<NodeJS.Timeout | null>(null)
	// The function to run on every interval
	const intervalFn = useCallback(() => {
		setInfo(prevState => (
			{
				...prevState,
				remaining: prevState.remaining - 1
			}
		))
	}, [setInfo])

	/*
	Start a countdown by setting an interval to run intervalFn every second
	 */
	const startCountdownInterval = useCallback(() => {
		// Run every 1000ms (1 second)
		const intervalSpacingMs: number = 1000

		intervalId.current = setInterval(
			intervalFn,
			intervalSpacingMs
		)
	}, [intervalFn])

	/*
	Clear the current interval, if it is set
	 */
	const clearCountdownInterval = useCallback(() => {
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
	}, [])

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
		startCountdownInterval()
		// Update status to running
		setInfo(prevState => (
			{
				...prevState,
				status: CountdownStatus.Running
			}
		))
	}, [info.remaining, startCountdownInterval])

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
		clearCountdownInterval()

		// Update state to paused
		setInfo(prevState => (
			{
				...prevState,
				status: CountdownStatus.Paused
			}
		))
	}, [intervalId, info.remaining, info.total, clearCountdownInterval])

	const reset = useCallback((newTotalSeconds: number) => {
		// If timer is paused, not started, or completed, do nothing
		if (intervalId.current === null && info.remaining === info.total) {
			console.log("Countdown has not started.")
			return
		}

		console.log("Resetting countdown")

		// Stop timer by clearing interval
		clearCountdownInterval()

		// Reset seconds and state
		setInfo({
			total: newTotalSeconds,
			remaining: newTotalSeconds,
			status: CountdownStatus.NotStarted,
		})
	}, [info.remaining, info.total, clearCountdownInterval, setInfo])

	const restart = useCallback((newTotalSeconds: number) => {
		console.log("Restarting countdown")

		// Explicitly clear any existing interval
		clearCountdownInterval()

		// Start the countdown
		startCountdownInterval()

		// Reset seconds and state to running
		setInfo({
			total: newTotalSeconds,
			remaining: newTotalSeconds,
			status: CountdownStatus.Running
		})
	}, [
		clearCountdownInterval,
		startCountdownInterval,
		setInfo,
	])

	// Check if countdown is complete
	useEffect(() => {
		/*
		If countdown is running AND remaining time is less or equal to 0
		 */
		if (info.status === CountdownStatus.Running && info.remaining <= 0) {
			clearCountdownInterval()

			// Set state to complete
			setInfo(prevState => {
				// Call on complete callback
				if (onCompleteActionRef.current) onCompleteActionRef.current()

				return {
					...prevState,
					status: CountdownStatus.Complete
				}
			})
		}
	}, [info.remaining, info.status, clearCountdownInterval]);

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