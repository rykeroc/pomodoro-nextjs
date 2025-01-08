"use server"

import {Quote} from "@prisma/client"
import {prisma} from "@/prisma";

async function getQuote(): Promise<Quote | null> {
	const count = await prisma.quote.count();
	const randomOffset = Math.floor(Math.random() * count);

	return prisma.quote.findFirst({
		orderBy: {
			id: "asc"
		},
		take: 1,
		skip: randomOffset
	})
}

export default getQuote
