import ThemeImage from "@/app/_components/theme/ThemeImage";
import PomodoroTimerIndicator from "@/app/_components/PomodoroTimerIndicator";
import {cn} from "@/app/_lib/utils/cn";
import SideMenu from "@/app/_components/sidemenu/SideMenu";
import FocusQuote from "@/app/_components/FocusQuote";

export default async function Page(){

	return (
		<div className={cn('overflow-x-visible')}>
			<SideMenu/>
			<PomodoroTimerIndicator/>
			<ThemeImage/>
			<FocusQuote/>
		</div>
	)
}
