import {QueryClient, useQuery} from "@tanstack/react-query";
import {fetchUserPreferences} from "@/app/_lib/actions/data/UserPreference";
import {Session} from "next-auth";

async function queryFn(session: Session | null) {
	if (!session || !session?.user || !session.user.id) return null
	return await fetchUserPreferences(session.user.id)
}

const queryKey = (session: Session | null) => ['userPreferences', session?.user?.id]

async function prefetchUserPreferencesQuery(queryClient: QueryClient, session: Session | null) {
	return queryClient.prefetchQuery({
		queryFn: async () => await queryFn(session),
		queryKey: queryKey(session),
	})
}

function useUserPreferencesQuery(session: Session | null) {
	return useQuery({
		queryFn: async () => await queryFn(session),
		queryKey: queryKey(session)
	})
}

export {
	prefetchUserPreferencesQuery,
	useUserPreferencesQuery
}