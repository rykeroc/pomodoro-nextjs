import {
	QueryClient,
	defaultShouldDehydrateQuery,
	isServer, QueryClientConfig,
} from '@tanstack/react-query'

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

function createQueryClient() {
	return new QueryClient(queryClientConfig)
}

let browserQueryClient: QueryClient | null = null

function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		return createQueryClient()
	} else {
		// Browser: make a new query client if we don't already have one
		// This is very important, so we don't re-make a new client if React
		// suspends during the initial render. This may not be needed if we
		// have a suspense boundary BELOW the creation of the query client
		if (!browserQueryClient) browserQueryClient = createQueryClient()
		return browserQueryClient
	}
}

export default getQueryClient
