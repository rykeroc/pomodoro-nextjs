"use client"

import PomodoroTimerIndicator from "@/app/_components/pomodoro/PomodoroTimerIndicator";
import {useState} from "react";
import {useSession} from "next-auth/react";
import usePomodoro, {IPomodoro} from "@/app/_lib/hooks/usePomodoro";
import {redirect} from "next/navigation";
import ActiveFocusTasksDialog from "@/app/_components/pomodoro/focusTasks/ActiveFocusTasksDialog";

export default function PomodoroComponents() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const closeDialog = () => setIsDialogOpen(false)
	const openDialog = () => setIsDialogOpen(true)

	const {data: session} = useSession()

	if (!session?.user?.id) redirect("/sign-in")

	const pomodoroData: IPomodoro = usePomodoro(session.user.id)

	return (
		<>
			<PomodoroTimerIndicator handleOpen={openDialog} pomodoroTimer={pomodoroData} focusTasksData={pomodoroData}/>
			<ActiveFocusTasksDialog isOpen={isDialogOpen} handleClose={closeDialog} focusTasksData={pomodoroData}/>
		</>
	)
}