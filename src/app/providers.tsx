"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";
import {ThemeProvider} from "@/app/_lib/contexts/theme/ThemeContext";
import {SessionProvider} from "next-auth/react";
import {UserPreference} from "@prisma/client";

interface ProvidersProps {
	children: ReactNode,
	initialUserPreference: UserPreference | null
}

export default function Providers({children, initialUserPreference}: ProvidersProps) {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ThemeProvider initialUserPreference={initialUserPreference}>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	)
}