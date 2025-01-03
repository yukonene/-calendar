/*
  Warnings:

  - A unique constraint covering the columns `[fileKey]` on the table `EventPhoto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `EventPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventPhoto" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventPhoto_fileKey_key" ON "EventPhoto"("fileKey");
