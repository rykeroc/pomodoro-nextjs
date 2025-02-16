import ThemeBackground from "@/components/feature/theme/ThemeBackground";
import {cn} from "@/lib/cn";
import FocusQuote from "@/components/feature/focus-quote/FocusQuote";
import PomodoroComponents from "@/components/feature/pomodoro/PomodoroComponents";
import TopBarMenus from "@/components/layout/TopBarMenus";
import SpotifyPlaylistButton from "@/components/feature/music/SpotifyPlaylistButton";
import getQueryClient from "@/lib/react-query/getQueryClient";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import prefetchQuotesQuery from "@/lib/react-query/prefetch-queries/prefetchQuotesQuery";
import {auth} from "@/lib/auth";
import prefetchFocusTasksQuery from "@/lib/react-query/prefetch-queries/prefetchFocusTasksQuery";

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
						<SpotifyPlaylistButton/>
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
