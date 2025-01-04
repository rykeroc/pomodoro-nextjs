"use client"

import {ArrowRightStartOnRectangleIcon, UserIcon} from "@heroicons/react/24/solid";
import Button from "@/app/_components/inputs/Button";
import {signOut, useSession} from "next-auth/react";
import {ISettingsMenuSection} from "@/app/_components/TopBarMenus/SettingsDialog/SettingsMenuSections";

const AccountSectionContent = () => {
	const { data: session } = useSession()

	const handleSignOut = () => signOut({redirectTo: "/sign-in"})

	return (
		<div className={"flex flex-col gap-4"}>
			<h5>Welcome back {session?.user?.name}</h5>

			<Button onClick={handleSignOut} variant={"secondary"}>
				<ArrowRightStartOnRectangleIcon className={'size-6'}/>
				Sign out
			</Button>
		</div>
	)
}

const AccountSection: ISettingsMenuSection = {
	title: "Account",
	icon: <UserIcon className={'size-5'}/>,
	content: <AccountSectionContent/>
}

export default AccountSection