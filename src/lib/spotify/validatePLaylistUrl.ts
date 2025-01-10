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

export default validatePlaylistUrl