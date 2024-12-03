type PomodoroStage = "focusSession" | "shortBreak" | "longBreak"

interface PomodoroStageInfo {
	name: string
	seconds: number
}

const PomodoroStages: { [key in PomodoroStage]: PomodoroStageInfo } = {
	focusSession: {
		name: 'Focus',
		seconds: 25 * 60
	},
	shortBreak: {
		name: 'Short Break',
		seconds: 5 * 60
	},
	longBreak: {
		name: 'Long Break',
		seconds: 15 * 60
	},
}

export type {
	PomodoroStageInfo
}

export default PomodoroStages
