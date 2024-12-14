"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode, useState} from "react";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "@/app/_lib/contexts/theme/ThemeContext";
import {ITheme} from "@/app/_lib/contexts/theme/IThemeContext";

interface ProvidersProps {
	initialTheme: ITheme,
	children: ReactNode,
}

export default function Providers({initialTheme, children}: ProvidersProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ThemeProvider initialData={initialTheme}>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	)
}