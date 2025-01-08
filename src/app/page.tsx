import ThemeBackground from "@/app/_components/theme/ThemeBackground";
import {cn} from "@/app/_lib/utils/cn";
import FocusQuote from "@/app/_components/FocusQuote";
import PomodoroComponents from "@/app/_components/pomodoro/PomodoroComponents";
import TopBarMenus from "@/app/_components/TopBarMenus";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import getUser from "@/app/_lib/actions/getUser";

export default async function Page() {
	const session = await auth()

	if (session?.user?.id) {
		// Get user from DB using user id in session
		const user = await getUser(session?.user?.id)
		console.log(`Home: ${user}`)

		// Redirect to sign in if user does not exist in DB
		if (!user) redirect("/sign-in")
	}

	return (
		<div>
			<div className={cn(
				"fixed", 'h-screen', 'w-screen', 'z-10', 'p-5',
				"flex", 'flex-col', 'justify-between'
			)}>
				<TopBarMenus/>
				<PomodoroComponents/>
				<FocusQuote/>
			</div>

			<div className={cn(
				"z-0", 'h-screen', 'w-screen',
				'fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
			)}>
				<ThemeBackground/>
			</div>
		</div>
	)
}
