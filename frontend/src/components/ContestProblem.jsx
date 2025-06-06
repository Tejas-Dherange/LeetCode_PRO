import React, { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";

function ContestProblem({ contestId }) {
  const { getContestById, isContestLoading, contest } = useContestStore();
  const { getProblemById, problem, isProblemLoading, getProblemByMultipleIds ,problems} =
    useProblemStore();
  const [Contest, setContest] = useState("");
  // const [problems, setProblems] = useState([]);

  useEffect(() => {
    getContestById(contestId);
    setContest(contest);
  }, [contestId]);

  useEffect(() => {
    if (!contest || !contest.problems || !Array.isArray(contest.problems)) return;
    const fetchProblems = async () => {
      const problemIds = contest.problems.map((p) => p.problemId);
      console.log("Problem IDs:", problemIds);
      try {
        const fetchedProblems = await getProblemByMultipleIds(problemIds);
        // console.log("Fetched Problems:", fetchedProblems);
        // setProblems(fetchedProblems || []);
      } catch (err) {
        console.error("Error fetching problems:", err);
        // setProblems([]);
      }
    };
    fetchProblems();
    console.log("Fetched Problems:", problems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contest]); // Only depend on contest, not getProblemById
  
  return (
    <div>
      {isContestLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border rounded-lg">
            <thead>
              <tr className="bg-base-200">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Constraints</th>
                <th className="px-4 py-2">Examples</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, idx) => (
                <tr key={problem.id} className="border-b hover:bg-base-200">
                  <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                  <td className="px-4 py-2 font-bold text-primary">{problem.title}</td>
                  <td className="px-4 py-2 text-xs">{problem.constraints || "-"}</td>
                  <td className="px-4 py-2 text-xs">
                    {problem.examples && Object.entries(problem.examples).length > 0 ? (
                      <ul className="list-disc list-inside">
                        {Object.entries(problem.examples).map(([lang, ex]) => (
                          <li key={lang}>
                            <span className="font-semibold">{lang}:</span> Input: {ex.input}, Output: {ex.output}
                          </li>
                        ))}
                      </ul>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContestProblem;
