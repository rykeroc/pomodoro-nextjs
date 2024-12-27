import {cn} from "@/app/_lib/utils/cn";
import {Dialog, DialogPanel, DialogTitle,} from "@headlessui/react";
import {glassEffectClasses} from "@/app/_components/common";
import {DialogBody, DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {FocusTask} from "@prisma/client";
import Button from "@/app/_components/inputs/Button";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import FocusTaskSection from "@/app/_components/pomodoro/focusTasks/FocusTaskSection";
import AddFocusTaskForm from "@/app/_components/pomodoro/focusTasks/AddFocusTaskForm";

interface IFocusTasksDialogProps {
	isOpen: boolean
	focusTasksData: IFocusTasksData
	handleClose: () => void
}

export default function FocusTasksDialog({isOpen, handleClose, focusTasksData}: IFocusTasksDialogProps) {
	const todoTasks: FocusTask[] = focusTasksData.dataQuery.data?.filter(e => !e.isComplete) ?? []

	const completedTasks: FocusTask[] = focusTasksData.dataQuery.data?.filter(e => e.isComplete) ?? []

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
							"duration-300", "ease-in-out", "data-[closed]:transform-[scale(95%)]", "data-[closed]:opacity-0"
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

							{/* Tasks to do */}
							<FocusTaskSection title={"Todo"} focusTasks={todoTasks}
											  activeTask={focusTasksData.activeTask}/>

							<AddFocusTaskForm focusTasksData={focusTasksData}/>

							{/*	Completed tasks */}
							{
								completedTasks.length > 0 &&
                                <FocusTaskSection title={"Completed"} focusTasks={completedTasks}/>
							}

						</DialogBody>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
