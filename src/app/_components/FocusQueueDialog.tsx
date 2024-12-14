import {cn} from "@/app/_lib/utils/cn";
import {Button, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {glassEffectClasses} from "@/app/_components/common";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

interface FocusQueueProps {
	isOpen: boolean
	handleClose: () => void
}

export default function FocusQueueDialog({isOpen, handleClose}: FocusQueueProps) {
	return (
		<Dialog open={isOpen} as={"div"} onClose={handleClose}>
			<div className="fixed inset-0 z-50 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className={cn(
							'fixed', "z-50", "h-fit", "min-w-96",
							...glassEffectClasses, "p-4", "rounded-2xl",
							"flex", "flex-col", "items-center",
							"duration-300", "ease-in-out",
							"data-[closed]:transform-[scale(95%)]", "data-[closed]:opacity-0"
						)}
					>
						<DialogHeader className={"w-full"}>
							<Button onClick={handleClose}>
								<CloseIcon/>
							</Button>
						</DialogHeader>
						<DialogTitle as={"h3"}>
							Focus Queue
						</DialogTitle>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}