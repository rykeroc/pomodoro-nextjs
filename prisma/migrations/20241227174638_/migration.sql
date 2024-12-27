/*
  Warnings:

  - You are about to drop the `FocusTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FocusTask" DROP CONSTRAINT "FocusTask_user_id_fkey";

-- DropTable
DROP TABLE "FocusTask";

-- CreateTable
CREATE TABLE "focus_tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total_focus_seconds" INTEGER NOT NULL DEFAULT 0,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "focus_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "focus_tasks" ADD CONSTRAINT "focus_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
