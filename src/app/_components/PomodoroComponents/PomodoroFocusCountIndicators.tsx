import {cn} from "@/app/_lib/utils/cn";
import {PomodoroValues} from "@/app/_lib/hooks/usePomodoro";
import useUserPreferences from "@/app/_lib/hooks/useUserPreferences";

interface IIndicatorProps {
	isActive: boolean
}

function Indicator({ isActive }: IIndicatorProps) {
	const {theme} = useUserPreferences()

	const backgroundClass = theme.colorClasses.background ?? "bg-background"

	return <div className={cn(
		"size-2.5", "rounded-full", {
			[backgroundClass]: isActive,
			"bg-secondary-container opacity-50": !isActive
		}
	)}/>
}

interface IPomodoroFocusCountIndicatorsProps {
	focusCount: number
}

export default function PomodoroFocusCountIndicators({focusCount}: IPomodoroFocusCountIndicatorsProps){
	const indicators = Array.from({length: PomodoroValues.maxFocusCount}).map((_, i) => {
		// Mark indicators that correspond to the completed # of focus sessions
		const isActive = (focusCount % PomodoroValues.maxFocusCount) >= i + 1
		return <Indicator key={i} isActive={isActive}/>
	})

	return (
		<div className={cn(
			"flex", "flex-row", "gap-6"
		)}>
			{indicators}
		</div>
	)
}