"use client"

import {useState} from "react";
import {cn} from "@/lib/cn";
import {cx} from "class-variance-authority";
import Button from "@/components/common/Button";
import * as React from "react";
import SpotifyPlaylistDialog from "@/components/feature/music/SpotifyPlaylistDialog";
import useSpotifyState from "@/hooks/useSpotifyEmbedState";
import MusicBars from "@/components/feature/music/MusicBars";

export default function SpotifyPlaylistButton() {
	// Focus Tasks menu dialog handlers
	const [isOpen, setIsOpen] = useState(false)
	const close = () => setIsOpen(false)
	const open = () => setIsOpen(true)

	const {
		isPlaying,
	} = useSpotifyState()

	return (
		<>
			<Button variant={'glass'} className={
				cn(
					'px-3', 'visible',
					cx({'invisible': isOpen})
				)
			} onClick={open}>
				<div className={cn(
					'flex', 'flex-row', 'items-center', 'justify-center', 'gap-1', 'h-6'
				)}>
					<MusicBars isPlaying={isPlaying}/>
				</div>
			</Button>
			<SpotifyPlaylistDialog isOpen={isOpen} close={close}/>
		</>
	)
}
