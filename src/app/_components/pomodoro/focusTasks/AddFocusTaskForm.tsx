import {Field, Input} from "@headlessui/react";
import {cn} from "@/app/_lib/utils/cn";
import {fadeTransitionClasses} from "@/app/_components/common";
import {PlusIcon} from "@heroicons/react/24/solid";
import {UpsertFocusTaskType} from "@/app/_lib/actions/data/focusTasks/types";
import Form from "next/form";
import {useSession} from "next-auth/react";
import {IFocusTasksData} from "@/app/_lib/hooks/useFocusTasksData";
import {redirect} from "next/navigation";

interface IAddFocusTaskFormProps {
	focusTasksData: IFocusTasksData
}

export default function AddFocusTaskForm({focusTasksData}: IAddFocusTaskFormProps) {
	const {data: session} = useSession({
		required: true,
		onUnauthenticated() {
			redirect("/sign-in")
		}
	})

	if (!session?.user?.id) {
		return null;
	}

	const userId = session.user.id;

	async function handleSubmit(formData: FormData) {
		const taskName = formData.get("focusTaskName") as string

		if (!taskName) return

		const newTask: UpsertFocusTaskType = {
			name: taskName,
			userId: userId
		}
		await focusTasksData.upsertMutation.mutateAsync(newTask)
		await focusTasksData.query.refetch()
	}

	return (
		<Form action={handleSubmit}>

			{/* Add Text Field*/}
			<Field className={cn(
				"w-full", "flex", "flex-row", "flex-row-reverse", "justify-end", "items-center", "gap-2",
				...fadeTransitionClasses,
			)}>
				<Input
					name={"focusTaskName"} type={"text"} placeholder={"Add task"} required
					className={cn(
						"bg-transparent", "border-transparent", "text-primary-text", "placeholder-secondary-text",
						"focus:outline-none", "peer"
					)}
				/>
				<PlusIcon className={cn(
					"size-6", "fill-secondary-text",
					"peer", "peer-data-[focus]:fill-primary-text", "peer-data-[hover]:fill-primary-text"
				)}/>
			</Field>

		</Form>
	)
}

