class PomodoroStage {
	static readonly focusSession = new PomodoroStage('Focus', 25)
	static readonly shortBreak = new PomodoroStage('Short Break', 5)
	static readonly longBreak = new PomodoroStage('Long Break', 15)

	readonly name: string
	readonly durationMinutes: number

	private constructor(name: string, durationMinutes: number) {
		this.name = name;
		this.durationMinutes = durationMinutes;
	}

	getDurationSeconds = () => this.durationMinutes * 60
}

export default PomodoroStage