import React, { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

function ContestProblem({ contestId }) {
  const { getContestById, isContestLoading, contest, getAllProblemsInContest } =
    useContestStore();
  const {
    getProblemById,
    problem,
    isProblemLoading,
    getProblemByMultipleIds,
    problems,
  } = useProblemStore();

  const [contestproblems, setContestproblems] = useState([]);
  useEffect(() => {
    const fetchProblems = async () => {
      if (!contestId) return;
      try {
        const problems = await getAllProblemsInContest(contestId);
        console.log("Fetched Problems:", problems);
        setContestproblems(problems || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  // console.log("contest problems",await getAllProblemsInContest(contestId));

  const [Contest, setContest] = useState("");
  // const [problems, setProblems] = useState([]);

  useEffect(() => {
    getContestById(contestId);
    setContest(contest);
  }, [contestId]);

  useEffect(() => {
    if (!contest || !contest.problems || !Array.isArray(contest.problems))
      return;
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

  // Track solved problems and marks for the current user
  const [solvedMap, setSolvedMap] = useState({});
  useEffect(() => {
    const fetchSolved = async () => {
      if (!contestId) return;
      try {
        // Fetch contest submissions for the current user for this contest
        const res = await fetch(
          `/api/contest/contest-submission/user/${contestId}`
        );
        if (res.ok) {
          const data = await res.json();
          // Map: problemId -> obtainedMarks (pick highest)
          const map = {};
          (data.submissions || []).forEach((sub) => {
            if (sub.status === "Accepted" && sub.obtainedMarks > 0) {
              if (!map[sub.problemId] || sub.obtainedMarks > map[sub.problemId]) {
                map[sub.problemId] = sub.obtainedMarks;
              }
            }
          });
          setSolvedMap(map);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchSolved();
  }, [contestId]);

  return (
    <div>
      {isContestLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border rounded-xl shadow bg-gradient-to-r from-gray-900 to-gray-800">
            <thead>
              <tr className="bg-gradient-to-r from-primary/30 to-success/30 text-primary-content text-lg">
                <th className="px-6 py-3 rounded-tl-xl">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3 rounded-tr-xl">Marks</th>
              </tr>
            </thead>
            <tbody>
              {contestproblems && contestproblems.length > 0 ? (
                contestproblems.map((problem, idx) => {
                  const solved = solvedMap[problem.problem.id] !== undefined;
                  return (
                    <tr
                      key={problem.id}
                      className={
                        idx % 2 === 0
                          ? "bg-gray-800/80 hover:bg-primary/10 transition"
                          : "bg-gray-900/80 hover:bg-primary/10 transition"
                      }
                    >
                      <td className="px-6 py-3 font-bold text-xl text-center text-primary-content">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-3 text-center font-semibold">
                        <Link
                          to={`/dashboard/contest-execution/${contestId}/${problem.problem.id}`}
                          className="hover:underline text-primary-content block w-full h-full"
                        >
                          {problem.problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-center font-bold text-success text-lg">
                        {solved ? (
                          <span className="text-success font-bold">
                            {solvedMap[problem.problem.id]}
                          </span>
                        ) : (
                          problem.marks || "-"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-base-content/70">
                    No problems available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContestProblem;
