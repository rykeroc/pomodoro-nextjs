import {cn} from "@/app/_lib/utils/cn";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import ProviderButtons from "@/app/sign-in/_components/ProviderButtons";

export default async function SignIn() {
	const session = await auth()

	console.log(session)
	// Redirect to home if user is already signed in
	if (session?.user) redirect("/")

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