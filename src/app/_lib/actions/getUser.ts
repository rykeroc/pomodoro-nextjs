import {prisma} from "@/prisma";
import {User} from "@prisma/client"

async function getUser(id: string): Promise<User | null> {
	return prisma.user.findUnique({
		where: {
			id: id
		}
	})
}

export default getUser