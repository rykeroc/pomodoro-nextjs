"use client"

import {ReactNode, useState} from "react";
import getQueryClient from "@/app/_lib/react-query/getQueryClient";
import {QueryClientProvider} from "@tanstack/react-query";

interface IQueryProviderProps {
	children: ReactNode
}

export default function QueryProvider({children}: IQueryProviderProps){
	const [queryClient] = useState(getQueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
}