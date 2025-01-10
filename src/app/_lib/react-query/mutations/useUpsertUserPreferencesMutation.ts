import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {upsertUserPreferences} from "@/app/_lib/actions/userPreferences/userPreferencesActions";
import {UserPreference} from "@prisma/client";
import {IUpsertUserPreferences} from "@/app/_lib/actions/userPreferences/types";

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

