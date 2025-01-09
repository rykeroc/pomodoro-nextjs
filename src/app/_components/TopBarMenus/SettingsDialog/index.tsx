"use client"

import {cn} from "@/app/_lib/utils/cn";
import {glassEffectClasses, IDialogMenuProps} from "@/app/_components/common";
import {useState} from "react";
import Button from "@/app/_components/inputs/Button";
import VerticalLine from "@/app/_components/VerticalLine";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import SettingsMenuSections, {
	ISettingsMenuSection
} from "@/app/_components/TopBarMenus/SettingsDialog/SettingsMenuSections";

export default function SettingsDialog({isOpen, onClose}: IDialogMenuProps) {
	const [section, setSection] = useState(SettingsMenuSections[0])

	const sectionButtons = SettingsMenuSections.map((s: ISettingsMenuSection, index: number) => {
		const isActive = SettingsMenuSections.indexOf(section) === index

		return (
			<Button key={index} active={isActive} onClick={() => setSection(s)}>
				{s.icon}
				{s.title}
			</Button>
		)
	})

	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<div className={cn("w-full", "h-full", "flex", "flex-row", "justify-end")}>
					{/* Container */}
					<DialogPanel
						transition
						className={cn(
							'fixed', "z-50",
							"h-full", ...glassEffectClasses, "p-4", "rounded-l-2xl",
							"md:w-full", "xl:w-2/3", "2xl:w-1/2",
							"duration-300", "ease-in-out",
							"data-[closed]:translate-x-full", "data-[closed]:opacity-0"
						)}>
						<div className={cn("flex", "flex-row", "gap-6", "h-full")}>
							{/* Hide button */}
							<div className={cn('h-full', 'flex', 'flex-col', 'justify-center')}>
								<Button onClick={onClose}>
									<ChevronRightIcon className={'size-6'}/>
								</Button>
							</div>

							{/* Section buttons */}
							<div className={cn("flex", "flex-col", "gap-3")}>
								{sectionButtons}
							</div>

							<VerticalLine/>

							{/* Section content */}
							<div className={cn(
								"flex", "flex-col", "gap-5", 'w-full'
							)}>
								<DialogTitle as={"h3"}>
									{section.title}
								</DialogTitle>

								{section.content}
							</div>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	)
}

