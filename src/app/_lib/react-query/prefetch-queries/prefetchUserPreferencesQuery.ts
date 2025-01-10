import {QueryClient} from "@tanstack/react-query";
import {getUserPreferences} from "@/app/_lib/actions/userPreferences/userPreferencesActions";

async function prefetchUserPreferencesQuery(queryClient: QueryClient, userId: string | null): Promise<void> {
	console.log(`Prefetching user preferences for user ID ${userId}`)
	await queryClient.prefetchQuery({
		queryFn: async () => {
			const fetched = await getUserPreferences(userId)
			console.log(fetched)
			return fetched
		},
		queryKey: [userId]
	})
}

export default prefetchUserPreferencesQuery