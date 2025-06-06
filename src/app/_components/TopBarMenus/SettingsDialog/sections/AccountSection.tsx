"use client"

import {ArrowRightStartOnRectangleIcon, UserIcon} from "@heroicons/react/24/solid";
import Button from "@/app/_components/inputs/Button";
import {signOut, useSession} from "next-auth/react";
import {ISettingsMenuSection} from "@/app/_components/TopBarMenus/SettingsDialog/SettingsMenuSections";
import {User} from "next-auth";
import LoginProviderButtons from "@/app/_components/LoginProviderButtons";

const AccountSectionContent = () => {
	const { data: session } = useSession()

	const content = session?.user ? <SignedInContent user={session.user}/> : <SignedOutContent/>

	return (
		<div className={"flex flex-col gap-4"}>
			{content}
		</div>
	)
}

interface ISignedInContentProps {
	user: User
}

function SignedInContent({user}: ISignedInContentProps) {
	const handleSignOut = async () => {
		await signOut({redirectTo: "/"})
	}

	return (
		<>
			<p>Welcome back {user?.name}</p>

			<Button onClick={handleSignOut} variant={"secondary"}>
				<ArrowRightStartOnRectangleIcon className={'size-6'}/>
				Sign out
			</Button>
		</>
	)
}

function SignedOutContent() {
	return (
		<>
			<p>Sign in with one of the following providers.</p>

			<LoginProviderButtons/>
		</>
	)
}

const AccountSection: ISettingsMenuSection = {
	title: "Account",
	icon: <UserIcon className={'size-5'}/>,
	content: <AccountSectionContent/>
}

export default AccountSection