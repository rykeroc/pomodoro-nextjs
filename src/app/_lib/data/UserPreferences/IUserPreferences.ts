type PreferenceType = string | number

interface IUserPreferences {
	savePreference: (key: string, value: PreferenceType) => void
	getPreference: (key: string) => PreferenceType | null
}

export type {
	IUserPreferences,
	PreferenceType
}