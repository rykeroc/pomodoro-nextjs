"use server"

import {prisma} from "@/prisma";
import {UserPreference} from "@prisma/client";

type CreateUserPreferenceType = Omit<UserPreference, "id">

async function fetchUserPreferences(userId: string | null): Promise<UserPreference | null> {
	if (userId === null) return null
	console.log("Fetching user preferences")
	return prisma.userPreference.findUnique({
		where: {
			userId: userId
		}
	})
}

async function upsertUserPreferences(args: CreateUserPreferenceType): Promise<UserPreference> {
	return prisma.userPreference.upsert({
		update: {
			themeId: args.themeId
		},
		where: {
			userId: args.userId
		},
		create: {
			userId: args.userId,
			themeId: args.themeId
		},
	})
}

export {
	fetchUserPreferences,
	upsertUserPreferences
}