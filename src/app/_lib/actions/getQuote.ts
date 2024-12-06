"use server"

import axios from "axios";
import {QuoteResponseData} from "@/app/_lib/actions/responseModels";
import * as https from "node:https";

/*
 TODO:
  The current websites certificates have expired
  Use quotes from own database
 */
async function getQuote(): Promise<QuoteResponseData> {

	const url = "https://api.quotable.io/quotes/random"

	const httpsAgent = new https.Agent({
		rejectUnauthorized: process.env.NODE_ENV === "production"
	})

	const response = await axios.get(
		url,
		{
			httpsAgent
		}
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
