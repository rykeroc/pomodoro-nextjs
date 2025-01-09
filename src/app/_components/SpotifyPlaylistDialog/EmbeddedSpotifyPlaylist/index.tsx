"use client"

import {cn} from "@/app/_lib/utils/cn";
import {extractPlaylistId} from "@/app/_components/SpotifyPlaylistDialog/utils";


interface IEmbeddedSpotifyPlaylistProps {
	playlistUrl: string | null
}

export default function EmbeddedSpotifyPlaylist({playlistUrl}: IEmbeddedSpotifyPlaylistProps) {
	if (!playlistUrl) return null
	const playlistId = extractPlaylistId(playlistUrl)
	const embeddingSrc = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=1`
	return (
		<iframe
			className={cn(
				"w-full", "h-[32rem]",
				"rounded-lg"
			)}
			src={embeddingSrc}
			allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			loading="lazy"/>
	)
}