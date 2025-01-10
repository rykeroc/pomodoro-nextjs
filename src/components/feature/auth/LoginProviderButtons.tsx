"use client"

import Button from "@/components/common/Button";
import {signIn} from "next-auth/react";
import Image from "next/image";
import {cn} from "@/lib/cn";

interface SocialProvider {
	name: string
	logo: string
	logoAlt: string
}

export default function LoginProviderButtons() {
	const logoSize = 24

	const providers: SocialProvider[] = [
		{
			name: "GitHub",
			logo: "github-mark.svg",
			logoAlt: "GitHub logo"
		},
		{
			name: "Google",
			logo: "google-g.svg",
			logoAlt: "Google logo"
		},
		{
			name: "Spotify",
			logo: "spotify-logo.svg",
			logoAlt: "Spotify logo"
		}
	]

	const providerButtons = providers.map(p => {
		const handleSignIn = () => signIn(p.name.toLowerCase())

		return (
			<Button key={p.name} onClick={handleSignIn}>
				<Image src={`/logos/${p.logo}`} alt={p.logoAlt} width={logoSize} height={logoSize}/>
				<p>Continue with {p.name}</p>
			</Button>
		)
	})

	return (
		<div className={cn("flex", "flex-col", "gap-3")}>
			{providerButtons}
		</div>
	)
}