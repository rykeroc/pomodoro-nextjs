import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {deleteFocusTask} from "@/lib/actions/focus-tasks";
import {IFocusTaskDeleteArgs} from "@/lib/actions/focus-tasks/types";

type UseDeleteFocusTaskMutationOptions = UseMutationOptions<FocusTask, Error, IFocusTaskDeleteArgs, unknown>

function useDeleteFocusTaskMutation(
	options?: UseDeleteFocusTaskMutationOptions
) {
	return useMutation({
		...options,
		mutationFn: deleteFocusTask
	})
}

export default useDeleteFocusTaskMutation

