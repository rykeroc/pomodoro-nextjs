"use client"

import PomodoroTimer from "@/app/_components/pomodoro/PomodoroTimer";
import {useState} from "react";
import {useSession} from "next-auth/react";
import usePomodoro, {IPomodoro} from "@/app/_lib/hooks/usePomodoro";
import ActiveFocusTasksDialog from "@/app/_components/pomodoro/ActiveFocusTasksDialog";

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