import {FocusTask} from "@prisma/client";

function sortByNameAscending(a: FocusTask, b: FocusTask): number {
	return a.name.localeCompare(b.name)
}

function filterTodoTasks(tasks: FocusTask[] | null): FocusTask[] {
	if (!tasks || !Array.isArray(tasks))
		return [] as FocusTask[]

	return tasks.filter(e => !e.isComplete)
		.sort(sortByNameAscending)
}

function filterCompletedTasks(tasks: FocusTask[] | null): FocusTask[] {
	if (!tasks || !Array.isArray(tasks))
		return [] as FocusTask[]

	return tasks.filter(e => e.isComplete)
		.sort(sortByNameAscending)
}

export {
	sortByNameAscending,
	filterTodoTasks,
	filterCompletedTasks
}