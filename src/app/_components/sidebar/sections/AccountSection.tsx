import {ISidebarSection} from "@/app/_components/sidebar/ISidebarSection";
import {UserIcon} from "@heroicons/react/24/solid";
import Button from "@/app/_components/inputs/Button";
import Image from "next/image";
import {signIn, signOut, useSession} from "next-auth/react";

interface SocialProvider {
	name: string
	logo: string
	logoAlt: string
}

const providers: SocialProvider[] = [
	{
		name: "GitHub",
		logo: "github-mark.svg",
		logoAlt: "GitHub logo"
	},
	// {
	// 	name: "Google",
	// 	logo: "google-g.svg",
	// 	logoAlt: "Google logo"
	// }
]

const AccountSectionContent = () => {
	const { data: session } = useSession()
	const logoSize = 24
	const providerButtons = providers.map(p => (
		<Button key={p.name} onClick={() => signIn(p.name.toLowerCase())}>
			<Image src={`/logos/${p.logo}`} alt={p.logoAlt} width={logoSize} height={logoSize}/>
			<p>Sign in with {p.name}</p>
		</Button>
	))

	if (!session?.user)
		return (
			<div className={"flex flex-col gap-4"}>
				{providerButtons}
			</div>
		)

	return (
		<div className={"flex flex-col gap-4"}>
			<Button onClick={() => signOut()}>Sign out</Button>
		</div>
	)
}

const AccountSection: ISidebarSection = {
	title: "Account",
	icon: <UserIcon className={'size-5'}/>,
	content: <AccountSectionContent/>
}

export default AccountSection