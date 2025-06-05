-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_contestId_fkey";

-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_problemId_fkey";

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
