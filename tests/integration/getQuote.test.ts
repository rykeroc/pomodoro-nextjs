import {describe, expect, test} from "@jest/globals";
import getQuote from "@/lib/actions/getQuote";

describe.skip("getQuote action", () => {

	test("Success", async () => {
		const responseData = await getQuote()

		expect(responseData).toBeTruthy()
		if (responseData!.author)
			expect(responseData!.author.length).toBeGreaterThan(0)
		expect(responseData!.text.length).toBeGreaterThan(0)
	})

})