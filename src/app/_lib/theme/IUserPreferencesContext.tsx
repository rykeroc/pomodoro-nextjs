"use client"

import {createContext, ReactNode, useContext, useState} from "react";
import {useSession} from "next-auth/react";
import useUpsertUserPreferencesMutation from "@/app/_lib/react-query/mutations/useUpsertUserPreferencesMutation";
import {IUpsertUserPreferences} from "@/app/_lib/actions/userPreferences/types";
import globalThemes from "@/app/_lib/theme/globalThemes";
import {ITheme} from "@/app/_lib/theme/ITheme";
import useUserPreferencesQuery from "@/app/_lib/react-query/queries/useUserPreferencesQuery";
import getThemeById from "@/app/_lib/theme/getThemeById";

interface IUserPreferencesContext {
	theme: ITheme
	setTheme: (theme: ITheme) => void
	playlistUrl: string | null
	setPlaylistUrl: (url: string) => void
	error: string | null
}

const UserPreferencesContext = createContext<IUserPreferencesContext>(null!)

const useUserPreferences = () => {
	const context = useContext(UserPreferencesContext)
	if (!context) {
		throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
	}

	return context
}

interface IUserPreferencesProviderProps {
	children: ReactNode
}

interface IUserPreferencesState {
	theme: ITheme
	playlistUrl: string | null
}

const UserPreferencesProvider = (
	{children}: IUserPreferencesProviderProps
) => {
	const {data: session} = useSession()
	const userId = session?.user?.id ?? null

	const userPreferencesQuery = useUserPreferencesQuery(userId)
	const mutation = useUpsertUserPreferencesMutation()

	const [preferencesState, setPreferencesState] = useState<IUserPreferencesState>(() => {
		const {
			data: preferences
		} = userPreferencesQuery

		const savedThemeId: number | null = preferences?.themeId ?? null
		const savedTheme: ITheme | null = getThemeById(savedThemeId)
		const theme: ITheme = savedTheme ?? globalThemes[0]

		const playlistUrl = preferences?.lastPlaylistUrl ?? null

		return { theme, playlistUrl }
	})

	// Save id of selected theme
	const setTheme = async (theme: ITheme) => {
		// Set theme for user
		setPreferencesState(prev => ({
			...prev,
			theme
		}))

		if (!session?.user?.id)
			return

		const mutationArgs: IUpsertUserPreferences = {
			userId: session.user.id,
			themeId: theme.id
		}
		mutation.mutate(mutationArgs)
	}

	const setPlaylistUrl = async (playlistUrl: string) => {
		// Set playlist url
		setPreferencesState(prev => ({
			...prev,
			playlistUrl
		}))

		if (!session?.user?.id)
			return

		// Update the users last playlist
		const mutationArgs: IUpsertUserPreferences = {
			userId: session.user.id,
			lastPlaylistUrl: playlistUrl
		}
		mutation.mutate(mutationArgs)
	}

	return (
		<UserPreferencesContext.Provider value={{
			theme: preferencesState.theme,
			setTheme,
			playlistUrl: preferencesState.playlistUrl,
			setPlaylistUrl,
			error: mutation.error?.message ?? null,
		}}>
			{children}
		</UserPreferencesContext.Provider>
	)
}

export default UserPreferencesContext

export {
	useUserPreferences,
	UserPreferencesProvider
}

export type {
	IUserPreferencesContext
}