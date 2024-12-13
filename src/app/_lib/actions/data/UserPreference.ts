"use server"

import {prisma} from "@/prisma";
import {UserPreference} from "@prisma/client";

type CreateUserPreference = Omit<UserPreference, "id">

async function fetchUserPreferences(userId: string): Promise<UserPreference | null> {
	return prisma.userPreference.findUnique({
		where: {
			userId: userId
		}
	})
}

async function upsertUserPreferences(args: CreateUserPreference): Promise<UserPreference> {
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