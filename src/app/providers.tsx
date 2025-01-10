"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode, useState} from "react";
import {SessionProvider} from "next-auth/react";
import {Session} from "next-auth";

interface ProvidersProps {
	initialSession: Session | null,
	children: ReactNode,
}

export default function Providers({initialSession, children}: ProvidersProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={initialSession}>
					{children}
			</SessionProvider>
		</QueryClientProvider>
	)
}