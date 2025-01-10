import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter";
import authConfig from "@/lib/auth/auth.config";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
	callbacks: {
		async session({token, session}) {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}
			return session;
		},
	}
})
