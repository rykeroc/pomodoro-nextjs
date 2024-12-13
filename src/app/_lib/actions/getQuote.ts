"use server"

import axios from "axios";
import {QuoteResponseData} from "@/app/_lib/actions/responseModels";

/*
 TODO:
  The current websites certificates have expired
  Use quotes from own database
 */
async function getQuote(): Promise<QuoteResponseData> {

	const url = "https://zenquotes.io/api/quotes"

	const response = await axios.get(url)

	try {
		return response.data[0] as QuoteResponseData
	} catch (e) {
		console.log("Invalid or malformed response data")
		console.log(e)
		throw e
	}
}

export default getQuote
