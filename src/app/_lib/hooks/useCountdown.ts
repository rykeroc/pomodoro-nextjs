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
	start: (secondsToCount: number) => void
	pause: () => void
	resume: () => void
	reset: (newTotalSeconds: number) => void
}

interface ITimer {
	startedTimestamp: number | null;
	lastIntervalTimestamp: number | null;
	msTotal: number;
	msRemaining: number;
	requestId: number | null;
}

export default function useCountdown(startingSeconds: number, intervalMs = 1000): ICountdown {
	// Internal timer information
	const [countdownInfo, setCountdownInfo] = useState<CounterInfo>({
		total: startingSeconds,
		remaining: startingSeconds,
		status: CountdownStatus.NotStarted
	})

	const timer = useRef<ITimer | null>(null);

	// Function to execute when the countdown is completed
	const onCompleteActionRef = useRef<(() => void) | null>(null);
	// Setter for onCompleteActionRef
	const setOnCompleteAction = useCallback((callback: () => void) => {
		onCompleteActionRef.current = callback;
	}, []);

	const run = (ts: DOMHighResTimeStamp) => {
		if (!timer.current) return

		/*
		 Update the started and last interval timestamp
			if the timer was just started
		 */
		if (!timer.current.startedTimestamp) {
			timer.current.startedTimestamp = ts;
			timer.current.lastIntervalTimestamp = ts;
		}

		/*
		Update timer and countdown info if the correct amount of time has passed
			since the last interval
		 */
		const localInterval = Math.min(intervalMs, (timer.current.msRemaining || Infinity));

		if (timer.current.lastIntervalTimestamp && (ts - timer.current.lastIntervalTimestamp) >= localInterval) {
			timer.current.lastIntervalTimestamp += localInterval;

			setCountdownInfo(prev => {
				if (timer.current)
					timer.current!.msRemaining = (prev.remaining * 1000) - localInterval ;
				return {
					...prev,
					remaining: timer.current ? timer.current?.msRemaining / 1000 : 0
				}
			})
		}

		/*
		Continue countdown if the total time has not been completed
		 */
		if (timer.current.msTotal && (ts - timer.current.startedTimestamp) < timer.current.msTotal) {
			timer.current.requestId = window.requestAnimationFrame(run);
		}
		/*
		Stop the timer AND call the on complete action IF the timer has been completed
		 */
		else {
			timer.current = null;
			if (onCompleteActionRef.current) onCompleteActionRef.current()

			// Set state to complete
			setCountdownInfo(prev => {
				return {
					...prev,
					status: CountdownStatus.Complete
				}
			})
		}
	}

	const start = useCallback((secondsToCount: number) => {
		console.log(`Starting countdown with ${secondsToCount} seconds`)

		window.cancelAnimationFrame(timer.current?.requestId ?? 0);

		const newMsToCount = (secondsToCount) * 1000;
		timer.current = {
			startedTimestamp: null,
			lastIntervalTimestamp: null,
			msTotal: newMsToCount,
			msRemaining: newMsToCount,
			requestId: null,
		};
		timer.current.requestId = window.requestAnimationFrame(run);

		setCountdownInfo({
			total: secondsToCount,
			remaining: secondsToCount,
			status: CountdownStatus.Running
		})
	}, [setCountdownInfo])

	const pause = useCallback(() => {
		if (!timer.current) return

		console.log("Pausing countdown")

		window.cancelAnimationFrame(timer.current.requestId ?? 0);
		timer.current.startedTimestamp = null;
		timer.current.lastIntervalTimestamp = null;
		timer.current.msTotal = timer.current.msRemaining;
		setCountdownInfo(prev => ({
			...prev,
			status: CountdownStatus.Paused
		}))
	}, [setCountdownInfo]);

	const resume = useCallback(() => {
		if (!timer.current) return

		window.cancelAnimationFrame(timer.current.requestId || 0);
		timer.current.requestId = window.requestAnimationFrame(run);

		setCountdownInfo(prev => ({
			...prev,
			status: CountdownStatus.Running
		}))
	}, [setCountdownInfo])

	const reset = useCallback((secondsToCount: number) => {
		if (!timer.current) return

		window.cancelAnimationFrame(timer.current.requestId ?? 0);
		timer.current = {
			startedTimestamp: null,
			lastIntervalTimestamp: null,
			msTotal: 0,
			msRemaining: 0,
			requestId: null,
		};

		// Reset seconds and state
		setCountdownInfo({
			total: startingSeconds,
			remaining: secondsToCount,
			status: CountdownStatus.NotStarted,
		})
	}, [setCountdownInfo])

	// Cleanup
	useEffect(() => {
		return () => window.cancelAnimationFrame(timer.current?.requestId ?? 0);
	}, []);

	return {
		setOnCompleteAction,
		status: countdownInfo.status,
		remaining: countdownInfo.remaining,
		total: countdownInfo.total,
		start,
		resume,
		pause,
		reset,
	}
}