"use client"

import {useQuery, UseQueryResult} from "@tanstack/react-query";
import getQuote from "@/lib/actions/getQuote";
import {Quote} from "@prisma/client";

export default function useQuoteQuery(): UseQueryResult<Quote | null> {
	return useQuery({
		queryFn: getQuote,
		queryKey: ["quote"]
	})
}