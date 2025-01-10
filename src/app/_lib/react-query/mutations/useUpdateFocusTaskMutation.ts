import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {FocusTask} from "@prisma/client";
import {updateFocusTask} from "@/app/_lib/actions/focusTasks/focusTasksActions";
import {IFocusTaskUpdateArgs} from "@/app/_lib/actions/focusTasks/types";

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

