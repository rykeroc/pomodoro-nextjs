import {cn} from "@/app/_lib/utils/cn";
import {glassEffectClasses} from "@/app/_components/common";
import {useState} from "react";
import sidebarSections from "@/app/_components/sidebar/sidebarSections";
import Button from "@/app/_components/inputs/Button";
import VerticalLine from "@/app/_components/VerticalLine";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";

interface ISidebarProps {
	isOpen: boolean,
	handleClose: () => void
}

const Sidebar = ({isOpen, handleClose}: ISidebarProps) => {
	const [section, setSection] = useState(sidebarSections[0])

	const sectionButtons = sidebarSections.map((s, index) => (
		<Button key={index} variant={"none"} onClick={() => setSection(s)}>
			{s.icon}
			{s.title}
		</Button>
	))


	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<div className={cn("w-full", "h-full", "flex", "flex-row", "justify-end")}>
				{/* Container */}
				<DialogPanel
					transition
					className={cn(
						'fixed', "z-50",
						"h-full", ...glassEffectClasses, "p-4", "rounded-l-2xl", "w-3/4",
						"duration-300", "ease-in-out",
						"data-[closed]:translate-x-full", "data-[closed]:opacity-0"
					)}
				>
					<div className={cn("flex", "flex-row", "gap-6", "h-full")}>
						{/* Hide button */}
						<div className={cn('h-full', 'flex', 'flex-col', 'justify-center')}>
							<Button onClick={handleClose}>
								<ChevronRightIcon className={'size-6'} />
							</Button>
						</div>

						{/* Section buttons */}
						<div className={cn("flex", "flex-col", "gap-3")}>
							{sectionButtons}
						</div>

						<VerticalLine />

						{/* Section content */}
						<div className={cn(
							"flex", "flex-col", "gap-5", 'w-full'
						)}>
							<DialogTitle>
								{section.title}
							</DialogTitle>

							{section.content}
						</div>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	)
}

export default Sidebar