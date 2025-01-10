import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from 'next/font/google'
import {cn} from "@/app/_lib/utils/cn";
import Providers from "@/app/providers";
import {auth} from "@/auth";
import {ReactNode} from "react";

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

	return (
		<html lang="en">
		<body className={cn(montserrat.className, 'antialiased')}>
			<Providers initialSession={session}>
				{children}
			</Providers>
		</body>
		</html>
	);
}
