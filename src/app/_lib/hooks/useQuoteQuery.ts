import {useQuery, UseQueryResult} from "@tanstack/react-query";
import getQuote from "@/app/_lib/actions/getQuote";
import {Quote} from "@prisma/client";

export default function useQuoteQuery(): UseQueryResult<Quote | null> {
	const queryResult = useQuery({
		queryFn: getQuote,
		queryKey: ["quote"]
	})

	if (queryResult.error)
		console.log(queryResult.error)

	return queryResult
}