import PomodoroCountdownTimerStatus from "@/app/_lib/PomodoroTimerStatus";
import {clearInterval} from "node:timers";

export default class CountdownTimer {
	private _totalSeconds: number
	private _remainingSeconds: number
	private _timerStatus: PomodoroCountdownTimerStatus
	private _intervalId: NodeJS.Timeout | null;
	private readonly _onComplete: () => void
	private readonly _onInterval: (remainingSeconds: number) => void

	private readonly _intervalFunction: () => void = () => {
		// Update remaining seconds
		this._remainingSeconds--;
		this._onInterval(this._remainingSeconds)
		// Check if timer is complete
		if (this._remainingSeconds <= 0) {
			this.stopCountdown();
			// Call on complete callback
			this._onComplete()
		}
	}
	// Decrement timer every second
	private readonly _intervalSpacingMs: number = 1000

	private _isStarted = () => this._timerStatus === PomodoroCountdownTimerStatus.Started
	private _isStopped = () => this._timerStatus === PomodoroCountdownTimerStatus.Stopped
	private _isComplete = () => this._timerStatus === PomodoroCountdownTimerStatus.Complete

	private _clearInterval() {
		// Clear any running interval
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}

	constructor(
		totalSeconds: number,
		onComplete: () => void,
		onInterval: (remainingSeconds: number) => void,
	) {
		this._totalSeconds = this._remainingSeconds = totalSeconds;
		this._onComplete = onComplete
		this._onInterval = onInterval
		this._timerStatus = PomodoroCountdownTimerStatus.Stopped
		this._intervalId = null
	}

	set totalSeconds(value: number) {
		this._totalSeconds = value;
	}

	get remainingSeconds(): number {
		return this._remainingSeconds;
	}

	get timerStatus(): PomodoroCountdownTimerStatus {
		return this._timerStatus;
	}

	startCountdown(): PomodoroCountdownTimerStatus {
		// If already started or completed, do nothing
		if (this._isStarted() || this._isComplete()) {
			return this._timerStatus;
		}

		// If paused, continue timer
		if (this._isStopped()) {
			this._timerStatus = PomodoroCountdownTimerStatus.Started;
			return this._timerStatus;
		}

		// Start new countdown
		this._intervalId = setInterval(
			this._intervalFunction,
			this._intervalSpacingMs
		);
		this._timerStatus = PomodoroCountdownTimerStatus.Started;

		return this._timerStatus
	}

	stopCountdown(): PomodoroCountdownTimerStatus {
		// If already stopped or complete, do nothing
		if (this._isStopped() || this._isComplete()) {
			return this._timerStatus;
		}

		// Clear the interval
		this._clearInterval()

		this._timerStatus = PomodoroCountdownTimerStatus.Stopped
		return this._timerStatus
	}

	resetCountdown(newTotalSeconds?: number): [number, PomodoroCountdownTimerStatus] {
		// Stop timer if started
		this.stopCountdown()

		// Clear the interval
		this._clearInterval()

		this._timerStatus = PomodoroCountdownTimerStatus.Stopped

		// Set new total seconds if supplied
		if (newTotalSeconds)
			this._totalSeconds = newTotalSeconds
		// Reset seconds
		this._remainingSeconds = this._totalSeconds

		return [this._remainingSeconds, this._timerStatus]
	}
}

