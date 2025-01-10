"use client"

import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {UserPreference} from "@prisma/client";
import {getUserPreferences} from "@/lib/actions/user-preferences";

function useUserPreferencesQuery(userId: string | null): UseQueryResult<UserPreference | null> {
	return useQuery({
		queryFn: async () => {
			console.log(`Fetching user preferences for user ID ${userId}`)
			return await getUserPreferences(userId)
		},
		queryKey: [userId]
	})
}

export default useUserPreferencesQuery