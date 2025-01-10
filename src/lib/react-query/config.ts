import {defaultShouldDehydrateQuery, QueryClientConfig} from "@tanstack/react-query";

const queryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
		},
		dehydrate: {
			// include pending queries in dehydration
			shouldDehydrateQuery: (query) =>
				defaultShouldDehydrateQuery(query) ||
				query.state.status === 'pending',
		},
	},
}

export {
	queryClientConfig
}