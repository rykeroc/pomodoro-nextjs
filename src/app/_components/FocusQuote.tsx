"use client"

import {cn} from "@/app/_lib/utils/cn";
import useQuoteQuery from "@/app/_lib/hooks/useQuoteQuery";

export default function FocusQuote() {
	const quoteQuery = useQuoteQuery()
	return (
		<h6 className={cn("text-secondary-text", "py-6", "px-12", "text-center",)}>
			{quoteQuery.data ? `"${quoteQuery.data}"` : ''}
		</h6>
	)
}