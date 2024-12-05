"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";
import {ThemeProvider} from "@/app/_lib/contexts/theme/ThemeContext";

interface ProvidersProps {
	children: ReactNode
}

export default function Providers({children}: ProvidersProps){
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	)
}