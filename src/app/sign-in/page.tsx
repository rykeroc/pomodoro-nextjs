import {cn} from "@/app/_lib/utils/cn";
import {auth} from "@/auth";
import ProviderButtons from "@/app/sign-in/_components/ProviderButtons";
import getUser from "@/app/_lib/actions/getUser";
import {redirect} from "next/navigation";

export default async function SignIn() {
	const session = await auth()

	// Redirect to home if user is already signed in
	if (session?.user?.id) {
		// Get user from DB using user id in session
		const user = await getUser(session?.user?.id)
		console.log(`Sign in: ${user}`)

		// Redirect to home if user exists in DB
		if (user) redirect("/")
	}

	return (
		<div className={cn(
			"flex", "flex-col", "p-5", "gap-4",
			"bg-primary-container",
			"rounded-xl"
		)}>
			<div className={cn(
				"flex", "flex-col", "gap-2"
			)}>
				<h4>Sign in</h4>
				<p>
					Continue with one of the following providers.
				</p>
			</div>

			<ProviderButtons/>
		</div>
	)
}