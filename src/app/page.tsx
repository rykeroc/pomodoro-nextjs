import ThemeBackground from "@/app/_components/ThemeBackground";
import {cn} from "@/app/_lib/utils/cn";
import FocusQuote from "@/app/_components/FocusQuote";
import PomodoroComponents from "@/app/_components/PomodoroComponents";
import TopBarMenus from "@/app/_components/TopBarMenus";
import SpotifyPlaylistDialog from "@/app/_components/SpotifyPlaylistDialog";
import getQueryClient from "@/app/_lib/react-query/getQueryClient";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import prefetchQuotesQuery from "@/app/_lib/react-query/prefetch-queries/prefetchQuotesQuery";
import {auth} from "@/auth";
import prefetchFocusTasksQuery from "@/app/_lib/react-query/prefetch-queries/prefetchFocusTasksQuery";

export default async function Page() {
	const session = await auth()
	const userId = session?.user?.id ?? null

	const queryClient = getQueryClient()

	await prefetchFocusTasksQuery(queryClient, userId)
	await prefetchQuotesQuery(queryClient)

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div>

				<div className={cn(
					"fixed", 'h-screen', 'w-screen', 'z-10', 'p-5',
					"flex", 'flex-col', 'justify-between'
				)}>
					<TopBarMenus/>
					<PomodoroComponents/>

					<div className={cn(
						"flex", "flex-col", "items-center", "gap-3"
					)}>
						<SpotifyPlaylistDialog/>
						<FocusQuote/>
					</div>
				</div>

				<div className={cn(
					"z-0", 'h-screen', 'w-screen',
					'fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
				)}>
					<ThemeBackground/>
				</div>
			</div>

		</HydrationBoundary>
	)
}
