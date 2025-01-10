import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {upsertUserPreferences} from "@/lib/actions/user-preferences";
import {UserPreference} from "@prisma/client";
import {IUpsertUserPreferences} from "@/lib/actions/user-preferences/types";

type UseUpsertFocusTaskMutationOptions = UseMutationOptions<UserPreference, Error,  IUpsertUserPreferences, unknown>

function useUpsertUserPreferencesMutation(
	options? :UseUpsertFocusTaskMutationOptions
) {
	return useMutation({
		...options,
		mutationFn: upsertUserPreferences
	})
}

export default useUpsertUserPreferencesMutation

