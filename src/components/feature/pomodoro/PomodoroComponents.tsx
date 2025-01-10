"use client"

import PomodoroTimer from "@/components/feature/pomodoro/PomodoroTimer";
import {useState} from "react";
import {useSession} from "next-auth/react";
import usePomodoro, {IPomodoro} from "@/hooks/usePomodoro";
import ActiveFocusTasksDialog from "@/components/feature/pomodoro/ActiveFocusTasksDialog";

export default function PomodoroComponents() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const closeDialog = () => setIsDialogOpen(false)
	const openDialog = () => setIsDialogOpen(true)

	const {data: session} = useSession()

	const pomodoroData: IPomodoro = usePomodoro(session?.user?.id ?? "")

	return (
		<>
			<PomodoroTimer handleOpen={openDialog} pomodoroTimer={pomodoroData} focusTasksData={pomodoroData}/>
			<ActiveFocusTasksDialog isOpen={isDialogOpen} handleClose={closeDialog} focusTasksData={pomodoroData}/>
		</>
	)
}