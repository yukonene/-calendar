-- CreateTable
CREATE TABLE "EventPhoto" (
    "id" SERIAL NOT NULL,
    "fileKey" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
