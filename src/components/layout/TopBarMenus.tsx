"use client"

import {cn} from "@/lib/cn";
import {ReactNode, useState} from "react";
import Button from "@/components/common/Button";
import {Bars3Icon, ListBulletIcon} from "@heroicons/react/24/solid";
import {cx} from "class-variance-authority";
import * as React from "react";
import FocusTasksDialog from "@/components/feature/focus-tasks/FocusTasksDialog";
import SettingsDialog from "@/components/feature/settings/SettingsDialog";

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

	const iconClasses = ['size-6']
	const topBarButtonsList: TopBarButtons[] = [
		// Focus tasks menu
		{
			isOpen: isTasksOpen,
			onClick: openTasks,
			icon: <ListBulletIcon className={cn(iconClasses)}/>

		},
		// Settings menu
		{
			isOpen: isSettingsOpen,
			onClick: openSettings,
			icon: <Bars3Icon className={cn(iconClasses)}/>
		}
	]

	const topBarButtons = topBarButtonsList.map((item, index) => (
		<Button key={index} variant={'glass'} className={
			cn(
				'px-3', 'visible',
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