import FocusTask from "@/app/_lib/FocusTask";
import PomodoroStage from "@/app/_lib/PomodoroStage";
import CountdownTimer from "@/app/_lib/CountdownTimer";
import PomodoroCountdownTimerStatus from "@/app/_lib/PomodoroCountdownTimerStatus";
import PomodoroState from "@/app/_lib/PomodoroState";

interface PomodoroStatus {
	currentState: PomodoroState,
	currentStage: PomodoroStage,
	timerStatus: PomodoroCountdownTimerStatus
}

interface PomodoroManagerConstructorArgs {
	onStateChange: (pomodoroStatus: PomodoroStatus) => void,
	onStageStart: () => void,
	onStageComplete: () => void,
	onInterval: (remainingSeconds: number) => void
	assignedTask?: FocusTask | null
	focusSessionCount?: number
	startingPomodoroStage?: PomodoroStage
	startingPomodoroState?: PomodoroState
}

export default class PomodoroManager {
	private _assignedTask: FocusTask | null
	private _focusSessionCount: number
	private _currentStage: PomodoroStage
	private _currentState: PomodoroState
	private readonly _onStateChange: (pomodoroStatus: PomodoroStatus) => void
	private readonly _onStageStart: () => void
	private readonly _onStageComplete: () => void
	private readonly _onInterval: (remainingSeconds: number) => void
	private readonly _countdownTimer: CountdownTimer

	constructor(
		{
			onStateChange,
			onStageStart,
			onStageComplete,
			onInterval,
			assignedTask = null,
			focusSessionCount = 0,
			startingPomodoroStage = PomodoroStage.focusSession,
			startingPomodoroState = PomodoroState.FocusPending
		}: PomodoroManagerConstructorArgs
	) {
		this._assignedTask = assignedTask
		this._focusSessionCount = focusSessionCount
		this._onInterval = onInterval
		this._currentStage = startingPomodoroStage
		this._currentState = startingPomodoroState
		this._onStateChange = onStateChange
		this._onStageStart = onStageStart
		this._onStageComplete = () => {
			console.log(`Stage ${this.currentStage} complete`)
		}
		this._countdownTimer = new CountdownTimer(
			this._currentStage.getDurationSeconds(),
			this._onStageComplete,
			this._onInterval
		)
	}

	set assignedTask(value: FocusTask | null) {
		this._assignedTask = value;
	}

	get currentStage(): PomodoroStage {
		return this._currentStage;
	}

	get currentState(): PomodoroState {
		return this._currentState;
	}

	getTimerStatus(): PomodoroCountdownTimerStatus {
		return this._countdownTimer.timerStatus
	}

	getNextState(currentState: PomodoroState, currentStage: PomodoroStage, timer: CountdownTimer): PomodoroState {
		/*
		Focus Running if current state is focus pending or paused AND
		timer is running
		 */
		if (
			currentState === PomodoroState.FocusPending ||
			currentState === PomodoroState.FocusPaused &&
			timer.isRunning()
		) return PomodoroState.FocusRunning

		/*
		Focus Paused if current state is focus running AND
		timer is paused
		 */
		else if (
			currentState === PomodoroState.FocusRunning &&
			timer.isPaused()
		) return PomodoroState.FocusPaused

		/*
		Focus Complete if current state is focus running AND
		timer is complete
		 */
		else if (
			currentState === PomodoroState.FocusRunning &&
			timer.isComplete()
		) return PomodoroState.FocusComplete

		/*
		Short break running if current state is focus complete AND
		current stage is short break AND
		timer is running
		 */
		else if (
			currentState === PomodoroState.FocusComplete &&
			currentStage === PomodoroStage.shortBreak &&
			timer.isRunning()
		) return PomodoroState.ShortBreakRunning

		/*
		Long break running if current state is focus complete AND
		current stage is long break AND
		timer is running
		 */
		else if (
			currentState === PomodoroState.FocusComplete &&
			currentStage === PomodoroStage.longBreak &&
			timer.isRunning()
		) return PomodoroState.LongBreakRunning

		/*
		Focus Pending (Not started) if current state is focus paused AND
		timer is not started
		 */
		return PomodoroState.FocusPending
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

	startStage(): PomodoroStatus {
		if (this._countdownTimer.isNotStarted())
			this._onStageStart()
		const timerStatus = this._countdownTimer.startCountdown()
		this._currentState = this.getNextState(
			this._currentState, this._currentStage, this._countdownTimer
		)
		this._onStateChange({
			currentStage: this._currentStage,
			currentState: this._currentState,
			timerStatus: timerStatus
		})
		return {
			currentState: this._currentState,
			currentStage: this._currentStage,
			timerStatus: timerStatus
		}
	}

	pauseStage(): PomodoroStatus {
		const timerStatus =  this._countdownTimer.pauseCountdown()
		this._currentState = this.getNextState(
			this._currentState, this._currentStage, this._countdownTimer
		)
		this._onStateChange({
			currentStage: this._currentStage,
			currentState: this._currentState,
			timerStatus: timerStatus
		})
		return {
			currentState: this._currentState,
			currentStage: this._currentStage,
			timerStatus: timerStatus
		}
	}

	finishStage(): PomodoroStatus {
		this._currentStage = PomodoroStage.focusSession
		const timerInfo =  this._countdownTimer.resetCountdown(
			this._currentStage.getDurationSeconds()
		)
		this._currentState = this.getNextState(
			this._currentState, this._currentStage, this._countdownTimer
		)
		this._onStateChange({
			currentStage: this._currentStage,
			currentState: this._currentState,
			timerStatus: timerInfo.timerStatus
		})
		return {
			currentState: this._currentState,
			currentStage: this._currentStage,
			timerStatus: timerInfo.timerStatus
		}
	}

	startNextStage(): PomodoroStatus {
		// Stop the timer
		this._countdownTimer.pauseCountdown()

		// Assign the next stage
		this._currentStage = this.getNextStage(
			this._currentStage, this._focusSessionCount
		)
		// Reset the timer using the next stage duration
		const timerInfo = this._countdownTimer.resetCountdown(
			this._currentStage.getDurationSeconds()
		)
		this._onStateChange({
			currentStage: this._currentStage,
			currentState: this._currentState,
			timerStatus: timerInfo.timerStatus
		})

		// Start the timer
		this._countdownTimer.startCountdown()

		this._currentState = this.getNextState(
			this._currentState, this._currentStage, this._countdownTimer
		)

		this._onStageStart()

		return {
			currentState: this._currentState,
			currentStage: this._currentStage,
			timerStatus: timerInfo.timerStatus
		}
	}
}