import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {createFocusTask} from "@/lib/actions/focus-tasks";

type UseCreateFocusTaskMutationOptions = UseMutationOptions<FocusTask, Error, FormData, unknown>

function useCreateFocusTaskMutation(
	options?: UseCreateFocusTaskMutationOptions
) {
	return useMutation({
		...options,
		mutationFn: createFocusTask
	})
}

export default useCreateFocusTaskMutation

