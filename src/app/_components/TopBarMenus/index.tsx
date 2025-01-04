"use client"

import {cn} from "@/app/_lib/utils/cn";
import {ReactNode, useState} from "react";
import Button from "@/app/_components/inputs/Button";
import {Cog6ToothIcon, ListBulletIcon} from "@heroicons/react/24/solid";
import {cx} from "class-variance-authority";
import * as React from "react";
import FocusTasksDialog from "@/app/_components/TopBarMenus/FocusTasksDialog";
import SettingsDialog from "@/app/_components/TopBarMenus/SettingsDialog";

interface TopBarButtons {
	isOpen: boolean
	onClick: () => void
	icon: ReactNode
}

export default function TopBarMenus() {
	// Focus Tasks menu dialog handlers
	const [isTasksOpen, setIsTasksOpen] = useState(false)
	const closeTasks = () => setIsTasksOpen(false)
	const openTasks = () => setIsTasksOpen(true)

	// Settings menu dialog handlers
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const closeSettings = () => setIsSettingsOpen(false)
	const openSettings = () => setIsSettingsOpen(true)

	const topBarButtonsList: TopBarButtons[] = [
		// Focus tasks menu
		{
			isOpen: isTasksOpen,
			onClick: openTasks,
			icon: <ListBulletIcon className={'size-6'}/>

		},
		// Settings menu
		{
			isOpen: isSettingsOpen,
			onClick: openSettings,
			icon: <Cog6ToothIcon className={'size-6'}/>
		}
	]

	const topBarButtons = topBarButtonsList.map((item, index) => (
		<Button key={index} variant={'glass'} className={
			cn(
				'px-3',
				'visible',
				cx({'invisible': item.isOpen})
			)
		} onClick={item.onClick}>
			{
				item.icon
			}
		</Button>
	))

	return (
		<div className={cn(
			'w-full', 'flex', 'flex-row', 'justify-between',
		)}>
			{topBarButtons}

			<FocusTasksDialog isOpen={isTasksOpen} onClose={closeTasks}/>
			<SettingsDialog isOpen={isSettingsOpen} onClose={closeSettings}/>
		</div>
	)
}