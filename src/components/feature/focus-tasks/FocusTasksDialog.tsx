"use client"

import {cn} from "@/lib/cn";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {glassEffectClasses, IDialogMenuProps} from "@/components/common";
import FocusTasksDialogSection from "@/components/feature/focus-tasks/FocusTasksDialogSection";
import AddFocusTaskForm from "@/components/feature/focus-tasks/AddFocusTaskForm";
import {FocusTask} from "@prisma/client";
import useFocusTasksData from "@/hooks/useFocusTasksData";
import {useSession} from "next-auth/react";
import Button from "@/components/common/Button";
import {ChevronLeftIcon} from "@heroicons/react/24/solid";
import {filterCompletedTasks, filterTodoTasks} from "@/lib/focusTasksHelpers";
import React from "react";


export default function FocusTasksDialog({isOpen, onClose}: IDialogMenuProps) {
	const {data: session} = useSession()

	const userId = session?.user?.id

	const content = userId ? <SignedInContent userId={userId}/> : <SignedOutContent/>

	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<div className={cn("w-full", "h-full", "flex", "flex-row", "justify-start")}>
					{/* Container */}
					<DialogPanel
						transition
						className={cn(
							'fixed', "z-50",
							"h-full", ...glassEffectClasses, "p-4", "rounded-r-2xl",
							"w-full", "md:w-3/4", "lg:w-2/3", "xl:w-1/2", "2xl:w-1/3",
							"duration-300", "ease-in-out",
							"data-[closed]:-translate-x-full", "data-[closed]:opacity-0"
						)}>
						<div className={cn("flex", "flex-row", "gap-6", "h-full")}>
							<div className={cn(
								"flex", "flex-col", "gap-5", "w-full"
							)}>
								<DialogTitle as={"h3"}>
									Focus Tasks
								</DialogTitle>

								{content}
							</div>

							{/* Hide button */}
							<div className={cn('h-full', 'flex', 'flex-col', 'justify-center')}>
								<Button onClick={onClose}>
									<ChevronLeftIcon className={'size-6'}/>
								</Button>
							</div>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	)
}

function SignedOutContent() {
	return (
		<p>Sign in to create focus tasks</p>
	)
}

interface ISignedInContentProps {
	userId: string
}

function SignedInContent({userId}: ISignedInContentProps) {
	const focusTasksData = useFocusTasksData(userId)

	const {
		data: tasks
	} = focusTasksData.query

	const todoTasks: FocusTask[] = filterTodoTasks(tasks ?? [])
	const completedTasks: FocusTask[] = filterCompletedTasks(tasks ?? [])

	return (
		<>
			<AddFocusTaskForm focusTasksData={focusTasksData}/>

			{
				todoTasks.length === 0 ? <p>There are currently no uncompleted focus tasks</p> : (
					<FocusTasksDialogSection title={"Todo"} focusTasks={todoTasks}
											 focusTasksData={focusTasksData}/>
				)
			}

			{/*	Completed tasks */}
			{
				completedTasks.length > 0 &&
                <FocusTasksDialogSection title={"Completed"} focusTasks={completedTasks}
                                         focusTasksData={focusTasksData}/>
			}
		</>
	)
}