import {cn} from "@/app/_lib/utils/cn";
import {Dialog, DialogPanel, DialogTitle,} from "@headlessui/react";
import {glassEffectClasses} from "@/app/_components/common";
import {DialogBody, DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {FocusTask} from "@prisma/client";
import Button from "@/app/_components/inputs/Button";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import {filterCompletedTasks, filterTodoTasks} from "@/app/_lib/utils/focusTasksHelpers";
import ActiveFocusTasksSection from "@/app/_components/pomodoro/ActiveFocusTasksDialog/ActiveFocusTaskSection";

interface IFocusTasksDialogProps {
	isOpen: boolean
	focusTasksData: IFocusTasksData
	handleClose: () => void
}

export default function ActiveFocusTasksDialog({isOpen, handleClose, focusTasksData}: IFocusTasksDialogProps) {
	const todoTasks: FocusTask[] = filterTodoTasks(focusTasksData.query.data ?? [])

	const completedTasks: FocusTask[] = filterCompletedTasks(focusTasksData.query.data ?? [])

	return (
		<Dialog open={isOpen} as={"div"} onClose={handleClose}>
			<div className="fixed inset-0 z-50 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className={cn(
							...glassEffectClasses,
							'fixed', "z-50", "h-fit", "min-w-96", "gap-4", "p-4", "rounded-2xl",
							"flex", "flex-col", "items-center",
							"duration-300", "ease-in-out",
							"data-[closed]:translate-y-full", "data-[closed]:transform-[scale(95%)]", "data-[closed]:opacity-0"
						)}>
						<DialogHeader className={"w-full"}>
							<Button onClick={handleClose}>
								<CloseIcon/>
							</Button>
						</DialogHeader>
						<DialogTitle as={"h3"}>
							Focus Tasks
						</DialogTitle>
						<DialogBody className={cn("flex", "flex-col", "w-full", "gap-4", "min-w-96")}>

							{
								todoTasks.length === 0 && (
									<p>No focus tasks have been created</p>
								)
							}

							{/* Tasks to do */}
							{
								todoTasks.length > 0 && (
									<ActiveFocusTasksSection title={"Todo"} focusTasks={todoTasks}
															 activeTask={focusTasksData.activeTask}
															 focusTasksData={focusTasksData}/>
								)
							}

							{/*	Completed tasks */}
							{
								completedTasks.length > 0 && (
									<ActiveFocusTasksSection title={"Completed"} focusTasks={completedTasks}
															 focusTasksData={focusTasksData}/>
								)
							}

						</DialogBody>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
