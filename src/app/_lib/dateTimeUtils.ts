function secondsToMinutes(seconds: number): string {
	const minutesStr = Math.floor(seconds / 60).toString().padStart(2, "0")
	const secondsStr = (seconds % 60).toString().padStart(2, "0")
	return `${minutesStr}:${secondsStr}`
}

export {
	secondsToMinutes
}