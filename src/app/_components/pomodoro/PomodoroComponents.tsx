"use client"

import PomodoroTimerIndicator from "@/app/_components/pomodoro/PomodoroTimerIndicator";
import FocusTasksDialog from "@/app/_components/pomodoro/FocusTasksDialog";
import {useState} from "react";
import {useSession} from "next-auth/react";
import usePomodoro, {IPomodoro} from "@/app/_lib/hooks/usePomodoro";
import {redirect} from "next/navigation";

export default function PomodoroComponents() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const closeDialog = () => setIsDialogOpen(false)
	const openDialog = () => setIsDialogOpen(true)

	const {data: session} = useSession()

	if (!session?.user?.id) redirect("/sign-in")

	const pomodoroData: IPomodoro = usePomodoro(session.user.id)

	return (
		<>
			<PomodoroTimerIndicator handleOpen={openDialog} timerInfo={pomodoroData} focusTasksData={pomodoroData}/>
			<FocusTasksDialog isOpen={isDialogOpen} handleClose={closeDialog} focusTasksData={pomodoroData}/>
		</>
	)
}