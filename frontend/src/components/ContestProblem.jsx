import React, { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import { useProblemStore } from "../store/useProblemStore";
import { axiosInstance } from "../libs/axios";
import { Loader, CheckCircle, Code2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

function ContestProblem({ contestId }) {
  const { getContestById, isContestLoading, contest, getAllProblemsInContest } =
    useContestStore();
  const {
    getProblemByMultipleIds,
  } = useProblemStore();

  const [contestproblems, setContestproblems] = useState([]);
  
  useEffect(() => {
    const fetchProblems = async () => {
      if (!contestId) return;
      try {
        const problems = await getAllProblemsInContest(contestId);
        setContestproblems(problems || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, [contestId]);

  const [solvedMap, setSolvedMap] = useState({});
  useEffect(() => {
    const fetchSolved = async () => {
      if (!contestId) return;
      try {
        const res = await axiosInstance.get(
          `/contest/contest-submission/user/${contestId}`
        );
        if (res.data.success) {
          const submissions = res.data.submissions || [];
          const map = {};
          submissions.forEach((sub) => {
            if (sub.status === "Accepted" && sub.obtainedMarks > 0) {
              if (!map[sub.problemId] || sub.obtainedMarks > map[sub.problemId]) {
                map[sub.problemId] = sub.obtainedMarks;
              }
            }
          });
          setSolvedMap(map);
        }
      } catch (err) {
        console.error("Error fetching solved problems:", err);
      }
    };
    fetchSolved();
  }, [contestId]);

  return (
    <div className="w-full">
      {isContestLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin w-8 h-8 text-emerald-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-base-content/5 bg-base-100/60 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70 text-sm uppercase tracking-wider border-b border-base-content/5">
                  <th className="px-6 py-4 font-bold w-20">#</th>
                  <th className="px-6 py-4 font-bold">Problem Title</th>
                  <th className="px-6 py-4 font-bold text-center w-32">Marks</th>
                </tr>
              </thead>
              <tbody>
                {contestproblems && contestproblems.length > 0 ? (
                  contestproblems.map((problem, idx) => {
                    const solved = solvedMap[problem.problem.id] !== undefined;
                    return (
                      <tr
                        key={problem.id}
                        className="hover:bg-base-content/5 transition-colors border-b border-base-content/5 last:border-none group"
                      >
                        <td className="px-6 py-4 font-mono text-base-content/50">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/contest-execution/${contestId}/${problem.problem.id}`}
                            className="flex items-center gap-3 group-hover:text-emerald-500 transition-colors font-medium text-base-content"
                          >
                            <div className={`p-2 rounded-lg ${solved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-base-200 text-base-content/40'}`}>
                               <Code2 className="w-5 h-5" />
                            </div>
                            {problem.problem.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {solved ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold bg-emerald-500/5 py-1 px-3 rounded-full border border-emerald-500/20">
                              <CheckCircle className="w-4 h-4" />
                              <span>{solvedMap[problem.problem.id]}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-base-content/40 font-mono text-sm">
                              <Trophy className="w-3 h-3" />
                              <span>{problem.marks || "-"}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-base-content/50">
                      <div className="flex flex-col items-center gap-2">
                        <Code2 className="w-8 h-8 opacity-20" />
                        <span>No problems available for this contest.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContestProblem;
