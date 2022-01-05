/*
  Warnings:

  - Added the required column `likes` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish_date` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "likes" INTEGER NOT NULL,
ADD COLUMN     "publish_date" TIMESTAMP NOT NULL,
ADD COLUMN     "tags" VARCHAR(255)[];
