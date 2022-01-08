/*
  Warnings:

  - You are about to drop the column `publish_date` on the `BlogPost` table. All the data in the column will be lost.
  - Added the required column `publishedDate` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "publish_date",
ADD COLUMN     "publishedDate" VARCHAR(255) NOT NULL;
