-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "healthConcern" TEXT,
ALTER COLUMN "link" DROP NOT NULL;
