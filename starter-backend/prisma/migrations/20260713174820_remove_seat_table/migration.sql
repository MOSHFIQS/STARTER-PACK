/*
  Warnings:

  - You are about to drop the `seats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "seats" DROP CONSTRAINT "seats_roomId_fkey";

-- DropTable
DROP TABLE "seats";

-- DropEnum
DROP TYPE "SeatStatus";
