function secondsToMinutes(seconds: number, includeSeconds: boolean = true): string {
	const minutesStr = Math.floor(seconds / 60).toString().padStart(2, "0")
	const secondsStr = (seconds % 60).toString().padStart(2, "0")
	return includeSeconds ? `${minutesStr}:${secondsStr}` : minutesStr
}

export {
	secondsToMinutes
}