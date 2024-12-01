import PomodoroCountdownTimerStatus from "@/app/_lib/PomodoroCountdownTimerStatus";
import {clearInterval} from "node:timers";

export type TimerInfo = {
	remainingSeconds: number,
	timerStatus: PomodoroCountdownTimerStatus
}

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
			this.pauseCountdown();
			// Call on complete callback
			this._onComplete()
		}
	}
	// Decrement timer every second
	private readonly _intervalSpacingMs: number = 1000

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
		this._timerStatus = PomodoroCountdownTimerStatus.NotStarted
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

	isNotStarted = () => this._timerStatus === PomodoroCountdownTimerStatus.NotStarted
	isRunning = () => this._timerStatus === PomodoroCountdownTimerStatus.Running
	isPaused = () => this._timerStatus === PomodoroCountdownTimerStatus.Paused
	isComplete = () => this._timerStatus === PomodoroCountdownTimerStatus.Complete

	startCountdown(): PomodoroCountdownTimerStatus {
		// If already started or completed, do nothing
		if (this.isRunning() || this.isComplete()) {
			return this._timerStatus;
		}

		// If paused or stopped, start countdown
		this._intervalId = setInterval(
			this._intervalFunction,
			this._intervalSpacingMs
		);
		this._timerStatus = PomodoroCountdownTimerStatus.Running;

		return this._timerStatus
	}

	pauseCountdown(): PomodoroCountdownTimerStatus {
		// If already stopped or complete, do nothing
		if (this.isPaused() || this.isNotStarted() || this.isComplete()) {
			return this._timerStatus;
		}

		// Clear the interval
		this._clearInterval()

		// Update timer status
		this._timerStatus = PomodoroCountdownTimerStatus.Paused
		return this._timerStatus
	}

	resetCountdown(newTotalSeconds?: number): TimerInfo {
		// Pause timer if started
		this.pauseCountdown()

		// Set new total seconds if supplied
		if (newTotalSeconds)
			this._totalSeconds = newTotalSeconds
		// Reset seconds
		this._remainingSeconds = this._totalSeconds

		// Update timer status
		this._timerStatus = PomodoroCountdownTimerStatus.NotStarted

		return {
			remainingSeconds: this._remainingSeconds,
			timerStatus: this._timerStatus
		}
	}
}

