import {QueryClient} from "@tanstack/react-query";
import getQuote from "@/lib/actions/getQuote";

async function prefetchQuotesQuery(queryClient: QueryClient): Promise<void> {
	await queryClient.prefetchQuery({
		queryFn: getQuote,
		queryKey: ["quote"]
	})
}

export default prefetchQuotesQuery