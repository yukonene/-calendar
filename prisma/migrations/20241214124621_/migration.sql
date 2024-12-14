/*
  Warnings:

  - You are about to drop the column `endDareTime` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endDareTime",
ADD COLUMN     "endDateTime" TIMESTAMP(3);
