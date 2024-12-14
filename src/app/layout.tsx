import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from 'next/font/google'
import {cn} from "@/app/_lib/utils/cn";
import Providers from "@/app/providers";
import {auth} from "@/auth";
import {fetchUserPreferences} from "@/app/_lib/actions/data/UserPreference";
import {ReactNode} from "react";
import globalThemes from "@/app/_lib/contexts/theme/globalThemes";

const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Focus Cafe",
	description: "Pomodoro timer app to manage focus duration.",
};

export default async function RootLayout({children,}: Readonly<{ children: ReactNode; }>) {
	const session = await auth()
	const userPreferences = await fetchUserPreferences(session?.user?.id ?? null)
	const theme = globalThemes.find(t => t.id === userPreferences?.themeId) ?? globalThemes[0]

	return (
		<html lang="en">
		<body className={cn(montserrat.className, 'antialiased')}>
			<Providers initialTheme={theme}>
				{children}
			</Providers>
		</body>
		</html>
	);
}
