/*
  Warnings:

  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile",
ADD COLUMN     "activityAreas" TEXT,
ADD COLUMN     "avatarFileKey" TEXT,
ADD COLUMN     "avatarOriginalFileName" TEXT,
ADD COLUMN     "favoriteGroup" TEXT,
ADD COLUMN     "favoriteType" TEXT,
ADD COLUMN     "strongPoints" TEXT;
