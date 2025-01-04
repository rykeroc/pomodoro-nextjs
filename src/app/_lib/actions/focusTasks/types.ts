interface IFocusTaskUpdateArgs {
	formData: FormData
	userId: string
}

interface IFocusTaskDeleteArgs {
	focusTaskId: string
	userId: string
}

export type {
	IFocusTaskUpdateArgs,
	IFocusTaskDeleteArgs
}