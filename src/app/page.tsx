import ThemeImage from "@/app/_components/theme/ThemeImage";
import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {cn} from "@/app/_lib/utils/cn";
import SideMenu from "@/app/_components/sidemenu/SideMenu";
import FocusQuote from "@/app/_components/FocusQuote";

export default async function Page(){

	return (
		<div>
			<div className={cn(
				"fixed", 'h-screen', 'w-screen', 'z-10', 'p-5',
				"flex", 'flex-col', 'justify-between'
			)}>
				<SideMenu/>
				<PomodoroTimerIndicator/>
				<FocusQuote/>
			</div>

			<div className={cn(
				"z-0", 'h-screen', 'w-screen',
				'fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
			)}>
				<ThemeImage/>
			</div>
		</div>
	)
}
