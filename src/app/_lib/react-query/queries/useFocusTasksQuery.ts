"use client"

import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getFocusTasks} from "@/app/_lib/actions/focusTasks/focusTasksActions";
import {FocusTask} from "@prisma/client";

function useFocusTasksQuery(userId: string | null): UseQueryResult<FocusTask[]> {
	return useQuery({
		queryFn: async () => await getFocusTasks(userId),
		queryKey: [userId]
	})
}

export default useFocusTasksQuery