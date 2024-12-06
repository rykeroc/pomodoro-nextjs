import {IUserPreferences, PreferenceType} from "@/app/_lib/data/UserPreferences/IUserPreferences";

class LocalUserPreferences implements IUserPreferences {
	static theme = "selectedTheme"

	getPreference(key: string): PreferenceType | null {
		return localStorage.getItem(key)
	}

	savePreference(key: string, value: PreferenceType): void {
		localStorage.setItem(key, value.toString())
	}
}

export default LocalUserPreferences