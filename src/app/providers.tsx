"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode, useState} from "react";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "@/app/_lib/contexts/theme/ThemeContext";
import {ITheme} from "@/app/_lib/contexts/theme/IThemeContext";
import {Session} from "next-auth";

interface ProvidersProps {
	initialTheme: ITheme,
	initialSession: Session | null,
	children: ReactNode,
}

export default function Providers({initialTheme, initialSession, children}: ProvidersProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={initialSession}>
				<ThemeProvider initialData={initialTheme}>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	)
}