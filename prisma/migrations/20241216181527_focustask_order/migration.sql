/*
  Warnings:

  - Added the required column `order` to the `FocusTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FocusTask" ADD COLUMN     "order" INTEGER NOT NULL;
