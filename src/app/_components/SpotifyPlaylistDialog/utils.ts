function validatePlaylistUrl(playlistUrl: string | null): boolean {
	if (!playlistUrl) return false

	const playlistUrlPatterns = [
		"https://open.spotify.com/playlist/",
		"https://open.spotify.com/embed/playlist/"
	]

	return playlistUrlPatterns.reduce((acc, curr) => {
		/*
		If URL is already valid, skip validation,
		Else validate the URL using the next pattern
		 */
		if (acc) return acc
		else return playlistUrl.startsWith(curr)
	}, false)
}

function extractPlaylistId(playlistUrl: string): string | null {
	const isValidUrl = validatePlaylistUrl(playlistUrl)
	if (!isValidUrl) return null

	const splitString = playlistUrl.split("/")
	return splitString[splitString.length - 1]
}

export {
	validatePlaylistUrl,
	extractPlaylistId
}