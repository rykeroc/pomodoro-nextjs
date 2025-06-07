import {z} from "zod";

const upsertRecentPlaylistSchema = z.object({
  id: z.string().optional(),
  userId: z
    .string()
    .nonempty(),
  playlistUrl: z
    .string()
    .nonempty({message: "Playlist URL is required"})
})

export {upsertRecentPlaylistSchema};