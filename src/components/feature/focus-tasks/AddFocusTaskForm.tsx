import {Field, Input} from "@headlessui/react";
import {cn} from "@/lib/cn";
import {PlusIcon} from "@heroicons/react/24/solid";
import Form from "next/form";
import {useSession} from "next-auth/react";
import {IFocusTasksData} from "@/hooks/useFocusTasksData";
import ErrorMessage from "@/components/common/ErrorMessage";

interface IAddFocusTaskFormProps {
	focusTasksData: IFocusTasksData
}

export default function AddFocusTaskForm({focusTasksData}: IAddFocusTaskFormProps) {
	const {data: session} = useSession()

	if (!session?.user?.id) {
		return null;
	}

	const userId = session.user.id;

	const {
		mutateAsync,
		isError,
		error
	} = focusTasksData.createMutation

	async function handleCreate(formData: FormData) {
		await mutateAsync(formData)
	}

	return (
		<Form action={handleCreate} className={cn("flex", "flex-col", "gap-2")}>
			{/* Add Text Field */}
			<Field className={cn(
				"w-full", "flex", "flex-row", "flex-row-reverse", "justify-end", "items-center", "gap-2",
			)}>
				<Input
					name={"name"}
					type={"text"}
					placeholder={"Add task"}
					className={cn(
						"bg-transparent", "border-transparent", "text-primary-text", "placeholder-secondary-text",
						"focus:outline-none", "peer"
					)}
					required
				/>
				<PlusIcon className={cn(
					"size-6", "fill-secondary-text",
					"peer", "peer-data-[focus]:fill-primary-text", "peer-data-[hover]:fill-primary-text"
				)}/>
			</Field>

			{
				isError &&
                <ErrorMessage>{error.message}</ErrorMessage>
			}

			<Input name={"userId"} type={"text"} value={userId} hidden readOnly/>
			<Input type={"submit"} hidden/>
		</Form>
	)
}

