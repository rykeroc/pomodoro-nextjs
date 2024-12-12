import {cn} from "@/app/_lib/utils/cn";
import {glassEffectClasses} from "@/app/_components/common";
import {useState} from "react";
import sidebarSections from "@/app/_components/sidebar/sidebarSections";
import Button from "@/app/_components/inputs/Button";
import VerticalLine from "@/app/_components/VerticalLine";
import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {Transition} from "@headlessui/react";
import {sortAscending} from "@/app/_lib/utils/sorting";

interface ISidebarProps {
	show: boolean,
	handleHide: () => void
}

const Sidebar = ({show, handleHide}: ISidebarProps) => {
	const [section, setSection] = useState(sidebarSections[0])

	const sectionButtons = sidebarSections.map((s, index) => (
		<Button key={index} variant={"none"} onClick={() => setSection(s)}>
			{s.icon}
			{s.title}
		</Button>
	))


	return (
		<Transition show={show}>
			<div
				className={cn(
					"w-full", "h-full",
					"flex", "flex-row", "justify-end"
				)}
			>
				{/* Container */}
				<aside
					className={cn(
						'fixed', "z-50",
						"h-full", ...glassEffectClasses, "p-4", "rounded-l-2xl", "w-3/4"
					)}
				>
					<div className={cn("flex", "flex-row", "gap-6", "h-full")}>
						{/* Hide button */}
						<div className={cn(
							'h-full', 'flex', 'flex-col', 'justify-center'
						)}>
							<Button onClick={handleHide}>
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
							<h3>
								{section.title}
							</h3>

							{section.content}
						</div>
					</div>
				</aside>
			</div>
		</Transition>
	)
}

export default Sidebar