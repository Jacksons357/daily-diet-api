/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_sessionId_key" ON "users"("sessionId");
