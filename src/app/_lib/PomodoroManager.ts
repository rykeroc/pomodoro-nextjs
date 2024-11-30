import FocusTask from "@/app/_lib/FocusTask";
import PomodoroStage from "@/app/_lib/PomodoroStage";
import CountdownTimer from "@/app/_lib/CountdownTimer";
import PomodoroCountdownTimerStatus from "@/app/_lib/PomodoroCountdownTimerStatus";

export default class PomodoroManager {
	private _assignedTask: FocusTask | null
	private _focusSessionCount: number
	private _currentStage: PomodoroStage
	private readonly _onComplete: () => void
	private readonly _onInterval: (remainingSeconds: number) => void
	private readonly _countdownTimer: CountdownTimer

	constructor(
		assignedTask: FocusTask | null = null,
		focusSessionCount: number = 0,
		onComplete: () => void,
		onInterval: (remainingSeconds: number) => void,
		startingPomodoroStage: PomodoroStage = PomodoroStage.focusSession
	) {
		this._assignedTask = assignedTask
		this._focusSessionCount = focusSessionCount
		this._onComplete = onComplete
		this._onInterval = onInterval
		this._currentStage = startingPomodoroStage
		this._countdownTimer = new CountdownTimer(
			this._currentStage.getDurationSeconds(),
			this._onComplete,
			this._onInterval
		)
	}

	set assignedTask(value: FocusTask | null) {
		this._assignedTask = value;
	}

	get currentStage(): PomodoroStage {
		return this._currentStage;
	}

	startCountdown(): PomodoroCountdownTimerStatus {
		return this._countdownTimer.startCountdown()
	}

	stopCountdown(): PomodoroCountdownTimerStatus {
		return this._countdownTimer.stopCountdown()
	}

	resetCountdown(newTotalSeconds?: number): [number, PomodoroCountdownTimerStatus] {
		return this._countdownTimer.resetCountdown(newTotalSeconds)
	}

	// TODO unit test this function
	getNextStage(currentStage: PomodoroStage, focusSessionCount: number): PomodoroStage {
		if (currentStage === PomodoroStage.focusSession && focusSessionCount % 4 > 0)
			return PomodoroStage.shortBreak
		else if (currentStage === PomodoroStage.focusSession && focusSessionCount % 4 === 0)
			return PomodoroStage.longBreak
		else
			return PomodoroStage.focusSession
	}

	startNextStage(): [number, PomodoroCountdownTimerStatus] {
		// Stop the timer
		this._countdownTimer.stopCountdown()

		// Assign the next stage
		this._currentStage = this.getNextStage(
			this._currentStage, this._focusSessionCount
		)

		// Reset the timer using the next stage duration
		const timerInfo = this._countdownTimer.resetCountdown(
			this._currentStage.getDurationSeconds()
		)

		// Start the timer
		this._countdownTimer.startCountdown()

		return timerInfo
	}

	resetPomodoroLoop(): [PomodoroStage, PomodoroCountdownTimerStatus] {
		// Stop the timer
		this._countdownTimer.stopCountdown()
		// Reset the stage to default
		this._currentStage = PomodoroStage.focusSession
		// Reset the timer using the default stage duration
		const [_, timerStatus] = this._countdownTimer.resetCountdown(
			this._currentStage.getDurationSeconds()
		)

		return [this._currentStage, timerStatus]
	}
}