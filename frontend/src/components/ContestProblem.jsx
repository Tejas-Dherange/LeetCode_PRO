import React, { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import { useProblemStore } from "../store/useProblemStore";

function ContestProblem({ contestId }) {
  const { getContestById, contest } = useContestStore();
  const { getProblemById } = useProblemStore();
  const [problems, setProblems] = useState([]);

  // Only fetch contest when contestId changes
  useEffect(() => {
    getContestById(contestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId]);

  // Fetch problems only when contest changes
  useEffect(() => {
    let ignore = false;
    async function fetchProblems() {
      if (contest && Array.isArray(contest.problems) && contest.problems.length > 0) {
        const problemIds = contest.problems.map((p) => p.problemId || p.id || (p.problem && p.problem.id));
        const validIds = problemIds.filter(Boolean);
        const problemsData = await Promise.all(
          validIds.map(async (problemId) => {
            const res = await getProblemById(problemId);
            return res && res.problem ? res.problem : undefined;
          })
        );
        if (!ignore) setProblems(problemsData.filter(Boolean));
      } else {
        if (!ignore) setProblems([]);
      }
    }
    fetchProblems();
    return () => { ignore = true; };
  }, [contest]);

//   console.log("Contest Problems:", problems);
  

  return (
    <div>
      {contest && contest.problems &&
        problems.map((problem) => (
          <div key={problem.id} className="p-4 border-b">
            <h2 className="text-xl font-bold">{problem.title}</h2>
            <p>{problem.description}</p>
            <p className="text-sm text-gray-500">
              Difficulty: {problem.difficulty}
            </p>
          </div>
        ))}

        
    </div>
  );
}

export default ContestProblem;
