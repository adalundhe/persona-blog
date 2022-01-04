/*
  Warnings:

  - You are about to drop the column `authorId` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the `BlogProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlogUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BlogProfile" DROP CONSTRAINT "BlogProfile_userId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "authorId",
ADD COLUMN     "author" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "BlogProfile";

-- DropTable
DROP TABLE "BlogUser";
