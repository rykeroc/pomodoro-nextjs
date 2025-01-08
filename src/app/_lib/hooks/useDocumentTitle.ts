"use client"

import {useRef} from "react";

interface IUseDocumentTitle {
	setTitle: (title: string | null) => void
}

function useDocumentTitle(): IUseDocumentTitle {
	const appName = "Focus Cafe"

	const titleRef = useRef(appName)

	const setTitle = (title: string | null) => {
		titleRef.current = title ? `${appName} | ${title}` : appName

		document.title = titleRef.current
	}

	return {
		setTitle
	}
}

export type {
	IUseDocumentTitle
}

export {
	useDocumentTitle
}