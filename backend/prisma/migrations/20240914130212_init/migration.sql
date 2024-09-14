/*
  Warnings:

  - The values [SCHEDULED,CANCELED,COMPLETED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ONLINE,OFFLINE] on the enum `AppointmentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [MALE,FEMALE] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [PATIENT,DOCTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `doctorId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('scheduled', 'canceled', 'completed');
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "AppointmentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentType_new" AS ENUM ('online', 'offline');
ALTER TABLE "Appointment" ALTER COLUMN "type" TYPE "AppointmentType_new" USING ("type"::text::"AppointmentType_new");
ALTER TYPE "AppointmentType" RENAME TO "AppointmentType_old";
ALTER TYPE "AppointmentType_new" RENAME TO "AppointmentType";
DROP TYPE "AppointmentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('male', 'female');
ALTER TABLE "Patient" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('patient', 'doctor');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_patientId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "doctorId",
DROP COLUMN "patientId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
ALTER COLUMN "city" DROP NOT NULL;
