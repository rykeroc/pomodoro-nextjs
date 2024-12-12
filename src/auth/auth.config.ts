import GitHub from "next-auth/providers/github";
import {NextAuthConfig} from "next-auth";

export default {
	providers: [
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET
		})
	],
} satisfies NextAuthConfig