interface IUpsertUserPreferences {
	userId: string
	themeId?: number
	lastPlaylistUrl?: string
}

export type {
	IUpsertUserPreferences
}