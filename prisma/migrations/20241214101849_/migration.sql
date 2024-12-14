/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Event` table. All the data in the column will be lost.
  - Added the required column `startDateTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "dateTime",
ADD COLUMN     "endDareTime" TIMESTAMP(3),
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
