import {Dialog, DialogPanel, DialogTitle, Field, Input} from "@headlessui/react";
import {cn} from "@/lib/cn";
import {glassEffectClasses} from "@/components/common";
import {DialogBody, DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import Button from "@/components/common/Button";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import * as React from "react";
import {useRef, useState} from "react";
import useUserPreferences from "@/hooks/useUserPreferences";
import validatePlaylistUrl from "@/lib/spotify/validatePLaylistUrl";
import EmbeddedSpotifyPlaylist from "@/components/feature/music/EmbeddedSpotifyPlaylist";
import Form from "next/form";
import ErrorMessage from "@/components/common/ErrorMessage";

interface IFormState {
  error: string | null
}

function DialogContent() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  function handleBlur() {
    if (inputRef.current) inputRef.current.blur()
  }

  const {
    playlistUrl,
    setPlaylistUrl
  } = useUserPreferences()

  const [formState, setFormState] = useState<IFormState>({
    error: null
  })

  function handleFormSubmit(formData: FormData) {
    const url = formData.get("url")
    if (!url) {
      setFormState({
        error: "Please enter a Spotify playlist URL"
      })
      return
    }

    const urlString = url.toString()
    const isValidUrl = validatePlaylistUrl(urlString)
    if (!isValidUrl) {
      setFormState({
        error: "Please enter a valid Spotify playlist URL"
      })
      return
    }

    setFormState({
      error: null,
    })
    handleBlur()

    setPlaylistUrl(urlString)
  }

  return (
    <>
      <EmbeddedSpotifyPlaylist playlistUrl={playlistUrl}/>

      <Form action={handleFormSubmit}>
        <Field className={cn(
          "flex", "flex-col", "gap-1"
        )}>
          <label>Play a <strong>Spotify</strong> playlist by entering a playlist URL</label>

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
    </>
  )
}

interface ISpotifyPlaylistDialogProps {
  isOpen: boolean
  close: () => void
}

export default function SpotifyPlaylistDialog({isOpen, close}: ISpotifyPlaylistDialogProps) {
  return (
    <Dialog open={isOpen} onClose={close} unmount={false}>
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
            <DialogHeader className={"w-full"}>
              <Button onClick={close}>
                <CloseIcon/>
              </Button>
            </DialogHeader>
            <DialogTitle as={"h3"}>
              Spotify Playlist
            </DialogTitle>
            <DialogBody className={cn("flex", "flex-col", "w-full", "gap-4",)}>

              <DialogContent/>

            </DialogBody>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}