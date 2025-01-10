import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {createFocusTask} from "@/app/_lib/actions/focusTasks/focusTasksActions";

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

