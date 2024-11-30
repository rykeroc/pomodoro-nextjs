import PomodoroTimerStatus from "@/app/_lib/PomodoroTimerStatus";
import {clearInterval} from "node:timers";

export default class Timer {
	private _targetSeconds: number
	private _elapsedSeconds: number
	private _timerStatus: PomodoroTimerStatus
	private _intervalId: NodeJS.Timeout | null;
	private readonly _onComplete: () => void
	private readonly _onInterval: (seconds: number) => void

	private readonly _intervalFunction: () => void = () => {
		// Update seconds
		this._elapsedSeconds++;
		this._onInterval(this._elapsedSeconds)
		// Check if timer is complete
		if (this._elapsedSeconds >= this._targetSeconds) {
			this.stopTimer();
			// Call on complete callback
			this._onComplete()
		}
	}
	// Increment timer every second
	private readonly _intervalSpacingMs: number = 1000

	private _isStarted = () => this._timerStatus === PomodoroTimerStatus.Started
	private _isStopped = () => this._timerStatus === PomodoroTimerStatus.Stopped
	private _isComplete = () => this._timerStatus === PomodoroTimerStatus.Complete

	private _clearInterval() {
		// Clear any running interval
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}

	constructor(
		targetSeconds: number,
		onInterval: (seconds: number) => void,
		onComplete: () => void,
		secondsElapsed: number = 0
	) {
		this._targetSeconds = targetSeconds;
		this._onComplete = onComplete
		this._onInterval = onInterval
		this._elapsedSeconds = secondsElapsed;
		this._timerStatus = PomodoroTimerStatus.Stopped
		this._intervalId = null
	}

	set targetSeconds(value: number) {
		this._targetSeconds = value;
	}

	get elapsedSeconds(): number {
		return this._elapsedSeconds;
	}

	get timerStatus(): PomodoroTimerStatus {
		return this._timerStatus;
	}

	startTimer(): PomodoroTimerStatus {
		// If already started or completed, do nothing
		if (this._isStarted() || this._isComplete()) {
			return this._timerStatus;
		}

		// If paused, continue timer
		if (this._isStopped()) {
			this._timerStatus = PomodoroTimerStatus.Started;
			return this._timerStatus;
		}

		// Start new timer
		this._timerStatus = PomodoroTimerStatus.Started;
		this._intervalId = setInterval(
			this._intervalFunction,
			this._intervalSpacingMs
		);

		return this._timerStatus
	}

	stopTimer(): PomodoroTimerStatus {
		// If already stopped or complete, do nothing
		if (this._isStopped() || this._isComplete()) {
			return this._timerStatus;
		}

		// Clear the interval
		this._clearInterval()

		this._timerStatus = PomodoroTimerStatus.Stopped
		return this._timerStatus
	}

	resetTimer(): [number, PomodoroTimerStatus] {
		// Stop timer if started
		this.stopTimer()

		// Clear the interval
		this._clearInterval()
		// Reset seconds
		this._elapsedSeconds = 0

		this._timerStatus = PomodoroTimerStatus.Stopped
		return [this._elapsedSeconds, this._timerStatus]
	}
}

