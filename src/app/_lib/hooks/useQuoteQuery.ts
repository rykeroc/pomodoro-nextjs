import {useQuery, UseQueryResult} from "@tanstack/react-query";
import getQuote from "@/app/_lib/actions/getQuote";
import {QuoteResponseData} from "@/app/_lib/actions/responseModels";

export default function useQuoteQuery(): UseQueryResult<QuoteResponseData> {
	const queryResult = useQuery({
		queryFn: async () => await getQuote(),
		queryKey: ["quote"]
	})

	if (queryResult.error)
		console.log(queryResult.error)

	return queryResult
}