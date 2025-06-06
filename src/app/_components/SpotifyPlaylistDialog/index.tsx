"use client"

import {useRef, useState} from "react";
import {cn} from "@/app/_lib/utils/cn";
import {cx} from "class-variance-authority";
import Button from "@/app/_components/inputs/Button";
import * as React from "react";
import {MusicalNoteIcon} from "@heroicons/react/24/solid";
import {Dialog, DialogPanel, DialogTitle, Field, Input} from "@headlessui/react";
import {glassEffectClasses} from "@/app/_components/common";
import Form from "next/form";
import ErrorMessage from "@/app/_components/ErrorMessage";
import EmbeddedSpotifyPlaylist from "@/app/_components/SpotifyPlaylistDialog/EmbeddedSpotifyPlaylist";
import {validatePlaylistUrl} from "@/app/_components/SpotifyPlaylistDialog/utils";

export default function SpotifyPlaylistDialog() {
	// Focus Tasks menu dialog handlers
	const [isOpen, setIsOpen] = useState(false)
	const close = () => setIsOpen(false)
	const open = () => setIsOpen(true)

	return (
		<>
			<Button variant={'glass'} className={
				cn(
					'px-3', 'visible',
					cx({'invisible': isOpen})
				)
			} onClick={open}>
				<MusicalNoteIcon className={cn("size-6")}/>
			</Button>

			<Dialog open={isOpen} onClose={close}>
				<div className="fixed inset-0 z-50 w-screen overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<DialogPanel
							transition
							className={cn(
								...glassEffectClasses,
								"w-1/2", 'fixed', "z-50", "gap-4", "p-4", "rounded-2xl",
								"flex", "flex-col", "items-center",
								"duration-300", "ease-in-out",
								"data-[closed]:translate-y-full", "data-[closed]:transform-[scale(95%)]", "data-[closed]:opacity-0"
							)}>
							<DialogTitle as={"h3"}>
								Spotify Playlist
							</DialogTitle>
							<div className={cn("flex", "flex-col", "w-full", "gap-4",)}>

								<DialogContent/>

							</div>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</>
	)
}

interface IFormState {
	playlistUrl: string | null
	error: string | null
}

function DialogContent() {
	const inputRef = useRef<HTMLInputElement | null>(null)
	function handleBlur() {
		if (inputRef.current) inputRef.current.blur()
	}

	const [formState, setFormState] = useState<IFormState>({
		playlistUrl: null,
		error: null
	})

	function handleFormSubmit(formData: FormData) {
		const url = formData.get("url")
		if (!url) {
			setFormState(prev => ({
				...prev,
				error: "Please enter a Spotify playlist URL"
			}))
			return
		}

		const isValidUrl = validatePlaylistUrl(url as string)
		if (!isValidUrl) {
			setFormState(prev => ({
				...prev,
				error: "Please enter a valid Spotify playlist URL"
			}))
			return
		}

		setFormState({
			error: null,
			playlistUrl: url as string
		})
		handleBlur()
	}

	return (
		<>
			<Form action={handleFormSubmit}>
				<Field className={cn(
					"flex", "flex-col", "gap-1"
				)}>
					<label>Play music from a spotify playlist by entering the URL in the field below</label>

					<Input
						ref={inputRef}
						name={"url"}
						type={"text"}
						placeholder={"Enter Spotify playlist URL"}
						className={cn(
							"w-full", "line-clamp-1",
							"bg-transparent", "border-transparent", "text-primary-text", "placeholder-secondary-text",
							"focus:outline-none",
						)}
					/>

					{
						formState.error && (
							<ErrorMessage>
								{formState.error}
							</ErrorMessage>
						)
					}
				</Field>

				<Input type={"submit"} hidden/>
			</Form>

			<EmbeddedSpotifyPlaylist playlistUrl={formState.playlistUrl}/>
		</>
	)
}