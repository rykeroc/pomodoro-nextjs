import {describe, expect, test} from "@jest/globals";
import getQuote from "../../src/app/_lib/actions/getQuote";

describe("getQuote action", () => {

	test("Success", async () => {
		const responseData = await getQuote()

		expect(responseData).toBeTruthy()
		if (responseData!.author)
			expect(responseData!.author.length).toBeGreaterThan(0)
		expect(responseData!.text.length).toBeGreaterThan(0)
	})

})