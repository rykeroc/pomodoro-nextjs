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

export type {
	PomodoroStageInfo
}

export {
	PomodoroStages,
}