import {QueryClient} from "@tanstack/react-query";
import {getFocusTasks} from "@/app/_lib/actions/focusTasks/focusTasksActions";

async function prefetchFocusTasksQuery(queryClient: QueryClient, userId: string | null): Promise<void> {
	await queryClient.prefetchQuery({
		queryFn: async () => getFocusTasks(userId),
		queryKey: [userId]
	})
}

export default prefetchFocusTasksQuery