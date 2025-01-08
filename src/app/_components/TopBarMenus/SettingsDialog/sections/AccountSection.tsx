"use client"

import {ArrowRightEndOnRectangleIcon, ArrowRightStartOnRectangleIcon, UserIcon} from "@heroicons/react/24/solid";
import Button from "@/app/_components/inputs/Button";
import {signOut, signIn, useSession} from "next-auth/react";
import {ISettingsMenuSection} from "@/app/_components/TopBarMenus/SettingsDialog/SettingsMenuSections";
import {User} from "next-auth";
import {redirect} from "next/navigation";

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
	const handleSignOut = () => signOut({redirectTo: "/sign-in"})

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
	const handleSignIn = () => redirect("/sign-in")

	return (
		<>
			<p>Create an account or sign in to help unlock your true potential!</p>

			<Button onClick={handleSignIn} variant={"secondary"}>
				<ArrowRightEndOnRectangleIcon className={'size-6'}/>
				Sign in
			</Button>
		</>
	)
}

const AccountSection: ISettingsMenuSection = {
	title: "Account",
	icon: <UserIcon className={'size-5'}/>,
	content: <AccountSectionContent/>
}

export default AccountSection