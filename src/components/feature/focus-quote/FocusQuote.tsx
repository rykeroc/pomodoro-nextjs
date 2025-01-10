"use client"

import {cn} from "@/lib/cn";
import useQuoteQuery from "@/lib/react-query/queries/useQuoteQuery";

export default function FocusQuote() {
	const quoteQuery = useQuoteQuery()

	const quote = quoteQuery.data ? `"${quoteQuery.data.text}"` : ""
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