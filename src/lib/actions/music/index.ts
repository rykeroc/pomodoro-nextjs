"use server"

import {upsertRecentPlaylistSchema} from "@/lib/actions/music/schema";
import {prisma} from "@/lib/prisma";
import {RecentPlaylist} from "@prisma/client";

export async function upsertRecentPlaylist(formData: FormData): Promise<RecentPlaylist> {
  const validatedFields = await upsertRecentPlaylistSchema.safeParseAsync({
    id: formData.get("id"),
    name: formData.get("name"),
    userId: formData.get("userId")
  })

  if (validatedFields.error){
    throw new Error(validatedFields.error.errors[0].message)
  }

  return prisma.recentPlaylist.upsert({
    where: {
      id: validatedFields.data.id,
    },
    update: {
      lastPlayed: new Date().toUTCString()
    },
    create: {
      userId: validatedFields.data.userId,
      playlistUrl: validatedFields.data.playlistUrl
    }
  })
}

export async function getRecentPlaylists(userId: string, limit: number = 5): Promise<RecentPlaylist[]> {
  return prisma.recentPlaylist.findMany({
    where: { userId },
    orderBy: { lastPlayed: "desc" },
    take: limit
  })
}