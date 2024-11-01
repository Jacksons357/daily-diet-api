/*
  Warnings:

  - You are about to drop the column `hours` on the `meals` table. All the data in the column will be lost.
  - Made the column `isDiet` on table `meals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "meals" DROP COLUMN "hours",
ALTER COLUMN "isDiet" SET NOT NULL;
