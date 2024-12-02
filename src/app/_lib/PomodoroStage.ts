class PomodoroStage {
	static readonly focusSession = new PomodoroStage('Focus', 25 * 60)
	static readonly shortBreak = new PomodoroStage('Short Break', 5 * 60)
	static readonly longBreak = new PomodoroStage('Long Break', 15 * 60)

	readonly name: string
	readonly seconds: number

	private constructor(name: string, seconds: number) {
		this.name = name;
		this.seconds = seconds;
	}
}

export default PomodoroStage