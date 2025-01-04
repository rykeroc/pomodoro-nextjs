"use client"

import {cn} from "@/app/_lib/utils/cn";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {glassEffectClasses, IDialogMenuProps} from "@/app/_components/common";
import FocusTaskSection from "@/app/_components/pomodoro/focusTasks/FocusTaskSection";
import AddFocusTaskForm from "@/app/_components/pomodoro/focusTasks/AddFocusTaskForm";
import {FocusTask} from "@prisma/client";
import useFocusTasksData from "@/app/_lib/hooks/useFocusTasksData";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import Button from "@/app/_components/inputs/Button";
import {ChevronLeftIcon} from "@heroicons/react/24/solid";
import {filterCompletedTasks, filterTodoTasks} from "@/app/_lib/utils/focusTasksHelpers";


export default function FocusTasksDialog({isOpen, onClose}: IDialogMenuProps) {
	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<div className={cn("w-full", "h-full", "flex", "flex-row", "justify-start")}>
					{/* Container */}
					<DialogPanel
						transition
						className={cn(
							'fixed', "z-50",
							"h-full", ...glassEffectClasses, "p-4", "rounded-r-2xl", "min-w-1/4",
							"duration-300", "ease-in-out",
							"data-[closed]:-translate-x-full", "data-[closed]:opacity-0"
						)}>
						<Content onClose={onClose}/>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	)
}

interface IContentProps {
	onClose: () => void
}

function Content({onClose}: IContentProps) {
	const {data: session} = useSession()

	if (!session?.user?.id) redirect("/sign-in")

	const focusTasksData = useFocusTasksData(session.user.id)

	const todoTasks: FocusTask[] = filterTodoTasks(focusTasksData.query.data ?? [])

	const completedTasks: FocusTask[] = filterCompletedTasks(focusTasksData.query.data ?? [])

	return (
		<div className={cn("flex", "flex-row", "gap-6", "h-full")}>
			<div className={cn(
				"flex", "flex-col", "gap-5", 'w-full'
			)}>
				<DialogTitle as={"h3"}>
					Focus Tasks
				</DialogTitle>
				<div className={cn("flex", "flex-col", "w-full", "gap-5",)}>
					<AddFocusTaskForm focusTasksData={focusTasksData}/>

					{/* Tasks to do */}
					<FocusTaskSection title={"Todo"} focusTasks={todoTasks}
									  activeTask={focusTasksData.activeTask}
									  focusTasksData={focusTasksData}/>


					{/*	Completed tasks */}
					{
						completedTasks.length > 0 &&
                        <FocusTaskSection title={"Completed"} focusTasks={completedTasks}
                                          focusTasksData={focusTasksData}/>
					}
				</div>
			</div>

			{/* Hide button */}
			<div className={cn('h-full', 'flex', 'flex-col', 'justify-center')}>
				<Button onClick={onClose}>
					<ChevronLeftIcon className={'size-6'}/>
				</Button>
			</div>
		</div>
	)
}