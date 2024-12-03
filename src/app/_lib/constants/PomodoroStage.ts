import PomodoroState from "@/app/_lib/constants/PomodoroState";

type PomodoroStage = "focusSession" | "shortBreak" | "longBreak"

interface PomodoroStageInfo {
	name: string
	seconds: number
}

const PomodoroStages: { [key in PomodoroStage]: PomodoroStageInfo } = {
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

function getStageFromState(state: PomodoroState): PomodoroStageInfo {
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

export type {
	PomodoroStageInfo
}

export {
	PomodoroStages,
	getStageFromState,
}