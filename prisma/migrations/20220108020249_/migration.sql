/*
  Warnings:

  - A unique constraint covering the columns `[hashnodeId]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "hashnodeId" VARCHAR(255),
ALTER COLUMN "devToId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_hashnodeId_key" ON "BlogPost"("hashnodeId");
