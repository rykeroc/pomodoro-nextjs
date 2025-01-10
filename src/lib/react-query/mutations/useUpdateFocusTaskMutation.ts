import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {updateFocusTask} from "@/lib/actions/focus-tasks";
import {IFocusTaskUpdateArgs} from "@/lib/actions/focus-tasks/types";

type UseUpdateFocusTaskMutationOptions = UseMutationOptions<FocusTask, Error, IFocusTaskUpdateArgs, unknown>

function useUpdateFocusTaskMutation(
	options?: UseUpdateFocusTaskMutationOptions
) {
	return useMutation({
		...options,
		mutationFn: updateFocusTask
	})
}

export default useUpdateFocusTaskMutation

