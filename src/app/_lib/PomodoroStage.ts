import PomodoroState from "@/app/_lib/enums/PomodoroState";

interface PomodoroStage {
	name: string
	seconds: number
}

const PomodoroStages: { [key: string]: PomodoroStage } = {
	focusSession: {
		name: 'Focus',
		seconds: 25
	},
	shortBreak: {
		name: 'Short Break',
		seconds: 5
	},
	longBreak: {
		name: 'Long Break',
		seconds: 15
	},
}

function getStageFromState(state: PomodoroState): PomodoroStage {
	switch (state) {
		case PomodoroState.FocusPending:
		case PomodoroState.FocusRunning:
		case PomodoroState.FocusPaused:
		case PomodoroState.FocusComplete:
			return PomodoroStages.focusSession
		case PomodoroState.ShortBreakRunning:
			return PomodoroStages.shortBreak
		case PomodoroState.LongBreakRunning:
			return PomodoroStages.longBreak
	}
}

function getNextStage(currentStage: PomodoroStage, focusCount: number): PomodoroStage {
	if (currentStage === PomodoroStages.focusSession && focusCount % 4 > 0)
		return PomodoroStages.shortBreak

	if (currentStage === PomodoroStages.focusSession && focusCount % 4 === 0)
		return PomodoroStages.longBreak

	return PomodoroStages.focusSession
}

export type {
	PomodoroStage
}

export {
	PomodoroStages,
	getStageFromState,
	getNextStage
}