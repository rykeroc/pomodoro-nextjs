import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from 'next/font/google'
import {cn} from "@/app/_lib/utils/cn";
import Providers from "@/app/providers";
import {auth} from "@/auth";
import {Session} from "next-auth";
import {UserPreference} from "@prisma/client";
import {fetchUserPreferences} from "@/app/_lib/actions/data/UserPreference";

const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Focus Cafe",
	description: "Pomodoro timer app to manage focus duration.",
};

async function getPreferences(session: Session | null): Promise<UserPreference | null> {
	if (!session || !session?.user || !session.user.id) return null

	try {
		return await fetchUserPreferences(session.user.id)
	} catch (e) {
		console.log(`Error while fetching UserPreference for user with ID ${session.user.id}`)
		console.log(e)
		return null
	}
}

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
	const session = await auth()
	const userPreferences = await getPreferences(session)

	return (
		<html lang="en">
		<body className={cn(montserrat.className, 'antialiased')}>
			<Providers initialUserPreference={userPreferences}>
				{children}
			</Providers>
		</body>
		</html>
	);
}
