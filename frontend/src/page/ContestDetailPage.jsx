import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContestStore } from "../store/useContestStore";
import { axiosInstance } from "../libs/axios";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trophy,
  Code,
  Loader,
  Search
} from "lucide-react";

function ContestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use selector-per-field pattern — avoids object reference issues
  const getContestById = useContestStore((s) => s.getContestById);
  const getAllProblemsInContest = useContestStore((s) => s.getAllProblemsInContest);
  const isContestLoading = useContestStore((s) => s.isContestLoading);
  const contest = useContestStore((s) => s.contest);

  const [problems, setProblems] = useState([]);

  // FIX: Only depend on [id]. Store function refs are NOT deps —
  // putting them in deps causes infinite re-renders when isContestLoading toggles.
  useEffect(() => {
    let cancelled = false;
    const fetchContestData = async () => {
      await getContestById(id);
      const contestProblems = await getAllProblemsInContest(id);
      if (!cancelled) setProblems(contestProblems || []);
    };
    fetchContestData();
    return () => { cancelled = true; };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":   return "bg-success/20 text-success border-success/30";
      case "Medium": return "bg-warning/20 text-warning border-warning/30";
      case "Hard":   return "bg-error/20 text-error border-error/30";
      default:       return "bg-base-300 text-base-content";
    }
  };

  if (isContestLoading || !contest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
          <Loader className="size-12 animate-spin text-emerald-500 relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 w-full relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/contest")}
          className="flex items-center gap-2 text-base-content/60 hover:text-emerald-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Contests</span>
        </button>

        <div className="max-w-5xl mx-auto">
          {/* Contest Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100/40 backdrop-blur-md border border-base-200 rounded-3xl p-8 mb-8 shadow-xl"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-base-content mb-4">
                  {contest.name}
                </h1>
                <p className="text-base-content/70 mb-6 leading-relaxed">
                  {contest.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
                  <div className="flex items-center gap-2 bg-base-200/50 px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Started: {new Date(contest.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-base-200/50 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>Ended: {new Date(contest.endTime).toLocaleString()}</span>
                  </div>
                  <div className="bg-base-200 text-base-content/60 px-4 py-2 rounded-lg font-semibold">
                    Status: Ended
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Problems Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                Problems ({problems.length})
              </h2>
            </div>

            {problems.length === 0 ? (
              <div className="text-center py-20 bg-base-100/50 backdrop-blur-sm rounded-3xl border border-base-200 border-dashed">
                <Code className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-xl font-bold text-base-content">No problems found</h3>
                <p className="text-base-content/50 mt-2">This contest doesn't have any problems yet</p>
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {problems.map((problem, index) => (
                  <motion.div
                    key={problem.problemId || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-base-100/40 backdrop-blur-md border border-base-200 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-base-content/50">#{index + 1}</span>
                          <h3 className="text-xl font-bold text-base-content group-hover:text-emerald-500 transition-colors">
                            {problem.title || problem.name || problem.problem?.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-sm font-medium text-base-content/60">
                            Points: <span className="text-emerald-500 font-bold">{problem.marks}</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/problem/${problem.problemId}`)}
                        className="btn bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Code className="w-4 h-4" />
                        Solve Problem
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Leaderboard — passes only contestId, fully self-contained */}
          <ContestLeaderboard contestId={id} />
        </div>
      </div>
    </div>
  );
}

// ─── Self-contained Leaderboard — NEVER touches the Zustand contest store ─────
// Uses axiosInstance directly so it never mutates isContestLoading,
// which would cascade into parent re-renders and create an infinite loop.
function ContestLeaderboard({ contestId }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async (p, s) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/contest/contest/${contestId}/leaderboard`,
        { params: { page: p, limit: 10, search: s } }
      );
      setLeaderboard(res.data.leaderboard || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchLeaderboard(1, "");
  }, [fetchLeaderboard]);

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchInput);
    fetchLeaderboard(1, searchInput);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchLeaderboard(newPage, appliedSearch);
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="font-bold text-base-content/60">#{rank}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-yellow-500 rounded-full" />
          <Trophy className="w-7 h-7" />
          Leaderboard
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search participant..."
            className="input input-sm input-bordered w-52 bg-base-200/50"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      <div className="bg-base-100/40 backdrop-blur-md border border-base-200 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-base-content/20" />
            <h3 className="text-xl font-bold text-base-content/50">No participants yet</h3>
            <p className="text-base-content/40 mt-1">No submissions were made in this contest</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/60 text-base-content/70 text-sm">
                    <th className="w-20 text-center">Rank</th>
                    <th>Participant</th>
                    <th className="text-center">Solved</th>
                    <th className="text-center">Score</th>
                    <th className="text-right">Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-base-200/40 transition-colors border-b border-base-200/50 ${
                        entry.rank <= 3 ? "bg-yellow-500/5" : ""
                      }`}
                    >
                      <td className="text-center">{getRankDisplay(entry.rank)}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-9 h-9 rounded-full ring-2 ring-offset-1 ring-emerald-500/30">
                              <img
                                src={entry.avatar || "https://avatar.iran.liara.run/public/boy"}
                                alt={entry.username}
                              />
                            </div>
                          </div>
                          <span className="font-semibold text-base-content">{entry.username}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-success badge-sm font-bold px-3">
                          {entry.solvedCount}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="text-yellow-500 font-black text-lg">{entry.totalMarks}</span>
                        <span className="text-base-content/40 text-xs ml-1">pts</span>
                      </td>
                      <td className="text-right text-sm text-base-content/50">
                        {entry.lastAcceptedAt
                          ? new Date(entry.lastAcceptedAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-base-200/50">
                <span className="text-sm text-base-content/50">
                  {leaderboard.length} of {pagination.total} participants
                </span>
                <div className="join">
                  <button
                    className="join-item btn btn-sm"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >«</button>
                  <button className="join-item btn btn-sm pointer-events-none">
                    {page} / {pagination.totalPages}
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    disabled={!pagination.hasMore}
                    onClick={() => handlePageChange(page + 1)}
                  >»</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ContestDetailPage;
