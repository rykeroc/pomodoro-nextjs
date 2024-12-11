import {describe, expect, test} from "@jest/globals";
import getQuote from "../../src/app/_lib/actions/getQuote";

describe("getQuote action", () => {

	test("Success", async () => {
		const responseData = await getQuote()

		expect(responseData).toBeTruthy()
		expect(responseData.a.length).toBeGreaterThan(0)
		expect(responseData.q.length).toBeGreaterThan(0)
	})

})