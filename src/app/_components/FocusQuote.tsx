"use client"

import {cn} from "@/app/_lib/utils/cn";
import useQuoteQuery from "@/app/_lib/hooks/useQuoteQuery";

export default function FocusQuote() {
	const quoteQuery = useQuoteQuery()

	const quote = quoteQuery.data ? `"${quoteQuery.data.q}"` : ''
	return (
		<div className={cn(
			"flex", "flex-row", "justify-center", "items-end"
		)}>
			<h6 className={cn(
				"text-secondary-text", "text-center",
			)}>
				{quote}
			</h6>
		</div>
	)
}