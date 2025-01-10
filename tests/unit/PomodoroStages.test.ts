import {describe, expect, test} from "@jest/globals";
import {PomodoroStages} from "@/hooks/usePomodoro";

/*
Tests to ensure that each stage has the proper duration.

This is important for development when the duration may be shortened for
testing purposes.
 */
describe('Pomodoro stages duration', () => {

	test('Focus session - 25 minutes', () => {
		const duration = 25 * 60
		expect(
			PomodoroStages.focusSession.seconds
		).toEqual(duration)
	})

	test('Short break - 5 minutes', () => {
		const duration = 5 * 60
		expect(
			PomodoroStages.shortBreak.seconds
		).toEqual(duration)
	})

	test('Long break - 15 minutes', () => {
		const duration = 15 * 60
		expect(
			PomodoroStages.longBreak.seconds
		).toEqual(duration)
	})

})