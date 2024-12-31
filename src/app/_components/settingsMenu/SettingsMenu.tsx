"use client"

import {cn} from "@/app/_lib/utils/cn";
import {glassEffectClasses} from "@/app/_components/common";
import {useState} from "react";
import Button from "@/app/_components/inputs/Button";
import VerticalLine from "@/app/_components/VerticalLine";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import SettingsMenuSections, {ISettingsMenuSection} from "@/app/_components/settingsMenu/SettingsMenuSections";
import {Cog6ToothIcon} from "@heroicons/react/24/solid";

export default function SettingsMenu() {
	const [isOpen, setIsOpen] = useState(false)
	const close = () => setIsOpen(false)
	const open = () => setIsOpen(true)

	const [section, setSection] = useState(SettingsMenuSections[0])

	const sectionButtons = SettingsMenuSections.map(
		(s: ISettingsMenuSection, index: number) => (
			<Button key={index} variant={"none"} onClick={() => setSection(s)}>
				{s.icon}
				{s.title}
			</Button>
		)
	)

	return (
		<>
			<div className={cn(
				'w-full', 'flex', 'flex-row', 'justify-end',
			)}>
				{/* Menu button */}
				<Button variant={'glass'} className={cn('px-3')} onClick={open}>
					<Cog6ToothIcon className={'size-6'}/>
				</Button>
			</div>

			<Dialog open={isOpen} onClose={close}>
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
								<Button onClick={close}>
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

