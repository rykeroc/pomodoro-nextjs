"use server"

import {prisma} from "@/prisma";
import {UserPreference} from "@prisma/client";
import {IUpsertUserPreferences} from "@/app/_lib/actions/userPreferences/types";
import {upsertUserPreferencesSchema} from "@/app/_lib/actions/userPreferences/schemas";

async function getUserPreferences(userId: string | null): Promise<UserPreference | null> {
	if (userId === null) return null
	return prisma.userPreference.findUnique({
		where: {
			userId: userId
		}
	})
}

async function upsertUserPreferences(args: IUpsertUserPreferences): Promise<UserPreference> {
	const validatedFields = await upsertUserPreferencesSchema.safeParseAsync(args)

	if (validatedFields.error){
		throw new Error(validatedFields.error.errors[0].message)
	}

	return prisma.userPreference.upsert({
		update: {
			themeId: validatedFields.data.themeId,
			lastPlaylistUrl: validatedFields.data.lastPlaylistUrl
		},
		where: {
			userId: validatedFields.data.userId
		},
		create: {
			userId: validatedFields.data.userId,
			themeId: validatedFields.data.themeId,
			lastPlaylistUrl: validatedFields.data.lastPlaylistUrl
		},
	})
}

export {
	getUserPreferences,
	upsertUserPreferences
}