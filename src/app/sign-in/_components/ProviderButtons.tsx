"use client"

import Button from "@/app/_components/inputs/Button";
import {signIn} from "next-auth/react";
import Image from "next/image";
import {cn} from "@/app/_lib/utils/cn";

interface SocialProvider {
	name: string
	logo: string
	logoAlt: string
}

export default function ProviderButtons() {
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
		}
	]

	const providerButtons = providers.map(p => (
		<Button key={p.name} onClick={() => signIn(p.name.toLowerCase())} variant={"none"}>
			<Image src={`/logos/${p.logo}`} alt={p.logoAlt} width={logoSize} height={logoSize}/>
			<p>Sign in with {p.name}</p>
		</Button>
	))

	return (
		<div className={cn("flex", "flex-col", "gap-3")}>
			{providerButtons}
		</div>
	)
}