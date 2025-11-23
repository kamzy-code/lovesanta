-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'adult';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'adult';
