import {PomodoroStage, PomodoroStages} from "@/app/_lib/PomodoroStage";
import CountdownStatus from "@/app/_lib/enums/CountdownStatus";

enum PomodoroState {
	FocusPending,
	FocusRunning,
	FocusPaused,
	FocusComplete,
	ShortBreakRunning,
	LongBreakRunning,
}

function getNextState(state: PomodoroState, status: CountdownStatus, focusCount: number): PomodoroState {
	const states = {
		isFocusPending: state === PomodoroState.FocusPending,
		isFocusRunning: state === PomodoroState.FocusRunning,
		isFocusComplete: state === PomodoroState.FocusComplete,
		isFocusPaused: state === PomodoroState.FocusPaused,
		isShortBreakRunning: state === PomodoroState.ShortBreakRunning,
		isLongBreakRunning: state === PomodoroState.LongBreakRunning
	}

	const statuses = {
		isNotStarted: status === CountdownStatus.NotStarted,
		isRunning: status === CountdownStatus.Running,
		isPaused: status === CountdownStatus.Paused,
		isComplete: status === CountdownStatus.Complete
	}

	/*
	Focus Running if current state is focus pending or paused AND
	status is running
	 */
	if (
		states.isFocusPending || states.isFocusPaused &&
		statuses.isRunning
	) return PomodoroState.FocusRunning

	/*
	Focus Paused if current state is focus running AND
	status is paused
	 */
	else if (
		states.isFocusRunning &&
		statuses.isPaused
	) return PomodoroState.FocusPaused

	/*
	Focus Complete if current state is focus running AND
	status is complete
	 */
	else if (
		states.isFocusRunning &&
		statuses.isComplete
	) return PomodoroState.FocusComplete

	/*
	Short break running if current state is focus complete AND
	current stage is short break AND
	status is running
	 */
	else if (
		states.isFocusComplete &&
		focusCount % 4 > 0 &&
		statuses.isRunning
	) return PomodoroState.ShortBreakRunning

	/*
	Long break running if current state is focus complete AND
	current stage is long break AND
	status is running
	 */
	else if (
		states.isFocusComplete &&
		focusCount % 4 === 0 &&
		statuses.isRunning
	) return PomodoroState.LongBreakRunning

	/*
	Focus Pending (Not started) if current state is focus paused AND
	status is not started
	 */
	return PomodoroState.FocusPending
}


export default PomodoroState

export {
	getNextState
}