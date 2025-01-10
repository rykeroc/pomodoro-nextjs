import validatePlaylistUrl from "@/lib/spotify/validatePLaylistUrl";

function extractPlaylistId(playlistUrl: string): string | null {
	const isValidUrl = validatePlaylistUrl(playlistUrl)
	if (!isValidUrl) return null

	const splitString = playlistUrl.split("/")
	return splitString[splitString.length - 1]
}

export default extractPlaylistId