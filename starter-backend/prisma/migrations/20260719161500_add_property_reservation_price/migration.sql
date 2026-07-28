-- Migration: add_property_reservation_price
-- Adds the missing `reservationPrice` column to the `properties` table.
-- This field was added to the Prisma schema as part of the Project/Plot merge
-- but was omitted from the previous migration.
ALTER TABLE "properties"
ADD COLUMN IF NOT EXISTS "reservationPrice" DOUBLE PRECISION;