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
	startedTimestamp: number | null
	lastIntervalTimestamp: number | null
	msTotal: number
	msRemaining: number
	requestId: number | null
	realStartTime: number | null
	pausedAt: number | null
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

	const run = useCallback((ts: DOMHighResTimeStamp) => {
		if (!timer.current) return

		// Initialize timer on the first run
		if (!timer.current.startedTimestamp) {
			timer.current.startedTimestamp = ts;
			timer.current.lastIntervalTimestamp = ts;
			timer.current.pausedAt = null;
		}

		const elapsedSinceLastInterval = ts - (timer.current.lastIntervalTimestamp ?? 0);

		// Handle large time gaps (e.g., computer sleep)
		if (elapsedSinceLastInterval > intervalMs * 2) {
			// Calculate how much time actually passed during sleep
			const actualTimePassedMs = Date.now() - (timer.current.realStartTime || Date.now());
			const remainingMs = Math.max(0, timer.current.msTotal - actualTimePassedMs);

			// Update timer state
			timer.current.msRemaining = remainingMs;
			timer.current.startedTimestamp = ts;
			timer.current.lastIntervalTimestamp = ts;

			setCountdownInfo((prev) => ({
				...prev,
				remaining: Math.ceil(remainingMs / 1000),
			}));

			if (remainingMs <= 0) {
				timer.current = null;
				if (onCompleteActionRef.current) onCompleteActionRef.current();

				setCountdownInfo((prev) => ({
					...prev,
					remaining: 0,
					status: CountdownStatus.Complete,
				}));
				return;
			}
		} else {
			// Regular interval update
			if (timer.current.lastIntervalTimestamp && elapsedSinceLastInterval >= intervalMs) {
				timer.current.lastIntervalTimestamp = ts;

				setCountdownInfo(prev => {
					const newRemainingMs = Math.max(0, (prev.remaining * 1000) - intervalMs);
					if (timer.current) timer.current.msRemaining = newRemainingMs;
					return {
						...prev,
						remaining: Math.ceil(newRemainingMs / 1000)
					};
				});
			}
		}

		/*
		Continue countdown if the total time has not been completed
		 */
		if (timer.current.msRemaining > 0) {
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
					remaining: 0,
					status: CountdownStatus.Complete
				}
			})
		}
	}, [intervalMs])

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
			realStartTime: Date.now(), // Track real wall clock time
			pausedAt: null
		};
		timer.current.requestId = window.requestAnimationFrame(run);

		setCountdownInfo({
			total: secondsToCount,
			remaining: secondsToCount,
			status: CountdownStatus.Running
		})
	}, [setCountdownInfo, run])

	const pause = useCallback(() => {
		if (!timer.current) return

		console.log("Pausing countdown")

		window.cancelAnimationFrame(timer.current.requestId ?? 0);
		timer.current.pausedAt = Date.now();
		timer.current.startedTimestamp = null;
		timer.current.lastIntervalTimestamp = null;

		setCountdownInfo(prev => ({
			...prev,
			status: CountdownStatus.Paused
		}))
	}, [setCountdownInfo]);

	const resume = useCallback(() => {
		if (!timer.current) return

		// Adjust realStartTime to account for pause duration
		if (timer.current.pausedAt) {
			const pauseDuration = Date.now() - timer.current.pausedAt;
			timer.current.realStartTime = (timer.current.realStartTime || 0) + pauseDuration;
			timer.current.pausedAt = null;
		}

		window.cancelAnimationFrame(timer.current.requestId || 0);
		timer.current.requestId = window.requestAnimationFrame(run);

		setCountdownInfo(prev => ({
			...prev,
			status: CountdownStatus.Running
		}))
	}, [setCountdownInfo, run])

	const reset = useCallback((secondsToCount: number) => {
		window.cancelAnimationFrame(timer.current?.requestId ?? 0);
		timer.current = {
			startedTimestamp: null,
			lastIntervalTimestamp: null,
			msTotal: secondsToCount * 1000,
			msRemaining: secondsToCount * 1000,
			requestId: null,
			realStartTime: null,
			pausedAt: null
		};

		// Reset seconds and state
		setCountdownInfo({
			total: secondsToCount,
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