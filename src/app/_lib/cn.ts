import {ClassValue} from "class-variance-authority/types";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(cx(inputs))
}