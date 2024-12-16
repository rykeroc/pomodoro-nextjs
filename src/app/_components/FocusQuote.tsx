"use client"

import {cn} from "@/app/_lib/utils/cn";
import useQuoteQuery from "@/app/_lib/hooks/useQuoteQuery";

export default function FocusQuote() {
	const quoteQuery = useQuoteQuery()
	if (!quoteQuery.data) return null

	const quote = `"${quoteQuery.data.q}"`
	return (
		<div className={cn(
			"fixed", "z-10",
			"w-full", "h-full", "py-6", "px-12",
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