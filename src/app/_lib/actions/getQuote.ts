"use server"


import axios from "axios";

type QuoteCategory = "inspirational"

interface QuoteResponseData {
	quote: string,
	author: string,
	category: string
}

async function getQuote(category: QuoteCategory = "inspirational"): Promise<QuoteResponseData> {
	const apiKey = process.env.NEXT_API_NINJAS_KEY
	if (!apiKey)
		throw new Error("Invalid API Ninjas API key")

	const baseUrl = "https://api.api-ninjas.com/v1/quotes"
	const params = new URLSearchParams()
	params.append("category", category)
	const finalUrl = `${baseUrl}?${params.toString()}`

	const headers = {
		"X-Api-Key": apiKey
	}

	const response = await axios.get(
		finalUrl,
		{headers}
	)

	try {
		return response.data[0] as QuoteResponseData
	} catch (e) {
		console.log("Invalid or malformed response data")
		console.log(e)
		throw e
	}
}

export default getQuote