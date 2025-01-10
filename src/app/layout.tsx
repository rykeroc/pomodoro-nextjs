import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from 'next/font/google'
import {cn} from "@/app/_lib/utils/cn";
import {auth} from "@/auth";
import {ReactNode} from "react";
import getQueryClient from "@/app/_lib/react-query/getQueryClient";
import {dehydrate, HydrationBoundary,} from "@tanstack/react-query";
import QueryProvider from "@/app/_components/QueryProvider";
import prefetchUserPreferencesQuery from "@/app/_lib/react-query/prefetch-queries/prefetchUserPreferencesQuery";
import {UserPreferencesProvider} from "@/app/_providers/UserPreferencesProvider";
import {SessionProvider} from "next-auth/react";

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
	const userId = session?.user?.id ?? null

	const queryClient = getQueryClient()
	await prefetchUserPreferencesQuery(queryClient, userId)

	return (
		<html lang="en">
		<body className={cn(montserrat.className, 'antialiased')}>

		<QueryProvider>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<SessionProvider session={session}>
					<UserPreferencesProvider>
						{children}
					</UserPreferencesProvider>
				</SessionProvider>
			</HydrationBoundary>
		</QueryProvider>

		</body>
		</html>
	);
}
