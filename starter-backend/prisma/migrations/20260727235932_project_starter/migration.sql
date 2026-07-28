/*
  Warnings:

  - The values [PROPERTY_CREATED,PROPERTY_UPDATED,PROPERTY_DELETED,PAYMENT_COMPLETED] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAYMENT,BOOKING] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `banner_slides` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inquiries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rentals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditAction_new" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'ADMIN_ACTION', 'PROFILE_CHANGE', 'ROLE_CHANGE', 'STATUS_CHANGE');
ALTER TABLE "audit_logs" ALTER COLUMN "action" TYPE "AuditAction_new" USING ("action"::text::"AuditAction_new");
ALTER TYPE "AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "public"."AuditAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'SYSTEM');
ALTER TABLE "public"."notifications" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
ALTER TABLE "notifications" ALTER COLUMN "type" SET DEFAULT 'INFO';
COMMIT;

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_rentalId_fkey";

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_userId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_rentalId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_rentalId_fkey";

-- AlterTable
ALTER TABLE "site_settings" ALTER COLUMN "siteName" SET DEFAULT 'StarterApp';

-- DropTable
DROP TABLE "banner_slides";

-- DropTable
DROP TABLE "blogs";

-- DropTable
DROP TABLE "inquiries";

-- DropTable
DROP TABLE "properties";

-- DropTable
DROP TABLE "rentals";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "rooms";

-- DropEnum
DROP TYPE "BlogStatus";

-- DropEnum
DROP TYPE "InquiryStatus";

-- DropEnum
DROP TYPE "InquiryTargetType";

-- DropEnum
DROP TYPE "PropertyPurpose";

-- DropEnum
DROP TYPE "PropertyStatus";

-- DropEnum
DROP TYPE "PropertyType";

-- DropEnum
DROP TYPE "RentalStatus";

-- DropEnum
DROP TYPE "ReviewStatus";

-- DropEnum
DROP TYPE "ReviewTargetType";

-- DropEnum
DROP TYPE "RoomStatus";

-- DropEnum
DROP TYPE "RoomType";
