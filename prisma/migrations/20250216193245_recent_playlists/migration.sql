-- CreateTable
CREATE TABLE "recent_playlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "playlist_url" TEXT NOT NULL,
    "last_played" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_playlists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recent_playlists" ADD CONSTRAINT "recent_playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
