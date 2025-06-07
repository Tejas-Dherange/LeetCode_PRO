/*
  Warnings:

  - Made the column `obtainedMarks` on table `ContestSubmission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ContestSubmission" ALTER COLUMN "obtainedMarks" SET NOT NULL,
ALTER COLUMN "obtainedMarks" SET DEFAULT 0;
