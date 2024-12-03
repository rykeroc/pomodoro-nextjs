import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {QuoteCategory} from "@/app/_lib/actions/types";
import getQuote from "@/app/_lib/actions/getQuote";
import {QuoteResponseData} from "@/app/_lib/actions/responseModels";

export default function useQuoteQuery(
	type: QuoteCategory = "inspirational"
): UseQueryResult<QuoteResponseData> {
	const queryResult = useQuery({
		queryFn: async () => await getQuote(type),
		queryKey: ["quote"]
	})

	if (queryResult.error)
		console.log(queryResult.error)

	return queryResult
}