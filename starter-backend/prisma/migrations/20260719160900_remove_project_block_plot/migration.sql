-- Migration: remove_project_block_plot
-- Removes Project, Block, and Plot models and merges their details into Property/Rental.
-- Data cleanup is performed BEFORE schema changes to avoid enum/table constraint errors.

-- ---------------------------------------------------------------------------
-- Step 1: Clean up data that references Project/Plot before dropping tables.
-- ---------------------------------------------------------------------------

-- Inquiries: reassign PROJECT/PLOT inquiries to GENERAL and clear target ids.
UPDATE "inquiries" SET "targetType" = 'GENERAL', "targetId" = NULL, "projectId" = NULL, "plotId" = NULL
  WHERE "targetType" IN ('PROJECT', 'PLOT');

-- Reviews: reassign PROJECT reviews to PROPERTY and clear project id.
UPDATE "reviews" SET "targetType" = 'PROPERTY', "projectId" = NULL
  WHERE "targetType" = 'PROJECT';

-- Properties: clear the project reference (project details are now merged in).
UPDATE "properties" SET "projectId" = NULL;

-- ---------------------------------------------------------------------------
-- Step 2: Drop foreign key constraints and columns referencing projects/plots.
-- ---------------------------------------------------------------------------

-- Drop foreign key constraints (names follow Prisma's <table>_<column>_fkey pattern).
ALTER TABLE "properties" DROP CONSTRAINT IF EXISTS "properties_projectId_fkey";
ALTER TABLE "inquiries" DROP CONSTRAINT IF EXISTS "inquiries_projectId_fkey";
ALTER TABLE "inquiries" DROP CONSTRAINT IF EXISTS "inquiries_plotId_fkey";
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_projectId_fkey";
ALTER TABLE "blocks" DROP CONSTRAINT IF EXISTS "blocks_projectId_fkey";
ALTER TABLE "plots" DROP CONSTRAINT IF EXISTS "plots_projectId_fkey";
ALTER TABLE "plots" DROP CONSTRAINT IF EXISTS "plots_blockId_fkey";

-- Drop the projectId / plotId columns.
ALTER TABLE "properties" DROP COLUMN IF EXISTS "projectId";
ALTER TABLE "inquiries" DROP COLUMN IF EXISTS "projectId";
ALTER TABLE "inquiries" DROP COLUMN IF EXISTS "plotId";
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "projectId";

-- ---------------------------------------------------------------------------
-- Step 3: Drop the Project, Block, and Plot tables.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS "plots";
DROP TABLE IF EXISTS "blocks";
DROP TABLE IF EXISTS "projects";

-- ---------------------------------------------------------------------------
-- Step 4: Update enums (remove unused variants, add ROOM to InquiryTargetType).
-- ---------------------------------------------------------------------------

-- InquiryTargetType: replace enum to remove PROJECT/PLOT and add ROOM.
ALTER TYPE "InquiryTargetType" RENAME TO "InquiryTargetType_old";
CREATE TYPE "InquiryTargetType" AS ENUM ('PROPERTY', 'RENTAL', 'ROOM', 'GENERAL');
ALTER TABLE "inquiries" ALTER COLUMN "targetType" DROP DEFAULT;
ALTER TABLE "inquiries" ALTER COLUMN "targetType" TYPE "InquiryTargetType" USING "targetType"::text::"InquiryTargetType";
ALTER TABLE "inquiries" ALTER COLUMN "targetType" SET DEFAULT 'GENERAL';
DROP TYPE "InquiryTargetType_old";

-- ReviewTargetType: replace enum to remove PROJECT.
ALTER TYPE "ReviewTargetType" RENAME TO "ReviewTargetType_old";
CREATE TYPE "ReviewTargetType" AS ENUM ('PROPERTY', 'RENTAL', 'ROOM', 'USER');
ALTER TABLE "reviews" ALTER COLUMN "targetType" DROP DEFAULT;
ALTER TABLE "reviews" ALTER COLUMN "targetType" TYPE "ReviewTargetType" USING "targetType"::text::"ReviewTargetType";
ALTER TABLE "reviews" ALTER COLUMN "targetType" SET DEFAULT 'PROPERTY';
DROP TYPE "ReviewTargetType_old";

-- Drop the now-unused Project/Plot enums.
DROP TYPE IF EXISTS "ProjectStatus";
DROP TYPE IF EXISTS "ProjectType";
DROP TYPE IF EXISTS "PlotStatus";
DROP TYPE IF EXISTS "PlotType";

-- ---------------------------------------------------------------------------
-- Step 5: Add merged land/plot fields to Property and Rental.
-- ---------------------------------------------------------------------------

-- Property: merged land/plot fields.
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "width" DOUBLE PRECISION;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "length" DOUBLE PRECISION;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "facing" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "isCorner" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "plotNumber" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "blockCode" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "totalArea" DOUBLE PRECISION;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "totalBlocks" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "totalPlots" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "soldPlots" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "reservedPlots" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "startingPrice" DOUBLE PRECISION;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "brochureUrl" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "handoverDate" TIMESTAMP(3);

-- Rental: merged land/plot fields.
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "width" DOUBLE PRECISION;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "length" DOUBLE PRECISION;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "facing" TEXT;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "isCorner" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "plotNumber" TEXT;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "blockCode" TEXT;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "totalArea" DOUBLE PRECISION;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "reservationPrice" DOUBLE PRECISION;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "brochureUrl" TEXT;
ALTER TABLE "rentals" ADD COLUMN IF NOT EXISTS "handoverDate" TIMESTAMP(3);
