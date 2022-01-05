/*
  Warnings:

  - A unique constraint covering the columns `[devToId]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `devToId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "devToId" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_devToId_key" ON "BlogPost"("devToId");
