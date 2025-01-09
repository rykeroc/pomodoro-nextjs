import {NextAuthConfig} from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";

export default {
	providers: [
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET,
			allowDangerousEmailAccountLinking: true
		}),
		Google({
			clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
			clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			},
			allowDangerousEmailAccountLinking: true
		}),
		Spotify({
			clientId: process.env.AUTH_SPOTIFY_CLIENT_ID,
			clientSecret: process.env.AUTH_SPOTIFY_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true
		})
	],
} satisfies NextAuthConfig