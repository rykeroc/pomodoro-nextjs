import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {deleteFocusTask} from "@/app/_lib/actions/focusTasks/focusTasksActions";
import {IFocusTaskDeleteArgs} from "@/app/_lib/actions/focusTasks/types";

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

