function sortAscending(a: string, b: string): number {
	return a.localeCompare(b)
}

function sortDescending(a: string, b: string): number {
	return b.localeCompare(a)
}

export {
	sortAscending,
	sortDescending
}