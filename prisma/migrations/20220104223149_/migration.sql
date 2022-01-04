/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `BlogPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "publishedAt",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" DROP DEFAULT;
