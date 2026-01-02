
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContestStore } from "../store/useContestStore";
import { Loader, Clock, Trophy, AlertCircle, Lock, FileText, Timer, Crown, Medal, Users } from "lucide-react";
import ContestProblem from "../components/ContestProblem";

function RegisterContestPage() {
  const { id } = useParams();

  const {
    contest,
    isContestLoading,
    getContestById,
    registerForContest,
    isRegisteredForContest,
    unRegisterContest,
  } = useContestStore();

  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startsIn, setStartsIn] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  // Helper: contest live check
  const isContestLive =
    contest?.startTime && new Date(contest.startTime) <= new Date();

  // Safe version of isRegisteredForContest wrapped with useCallback
  const checkRegistration = useCallback(async () => {
    if (!id) return;
    try {
      const registered = await isRegisteredForContest(id);
      setIsRegistered((prev) => {
        if (prev !== registered) return registered;
        return prev; // Avoid unnecessary re-renders
      });
    } catch (err) {
      console.error("Error checking registration status:", err);
    }
  }, [id, isRegisteredForContest]);

  useEffect(() => {
    if (id) {
      getContestById(id).catch((err) =>
        console.error("Failed to fetch contest:", err)
      );
    }
  }, [id]);

  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  const msToTime = (duration) => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const hours = Math.floor((duration / 1000 / 60 / 60) % 24);
    const days = Math.floor(duration / 1000 / 60 / 60 / 24);
    return `${days}d ${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getStartsIn = useCallback(() => {
    if (!contest?.startTime) return "-";
    const now = new Date();
    const start = new Date(contest.startTime);
    const diff = start.getTime() - now.getTime();
    return diff > 0 ? msToTime(diff) : "Started";
  }, [contest]);

  useEffect(() => {
    if (!contest?.startTime) return;

    const updateTime = () => {
      setStartsIn(getStartsIn());
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [getStartsIn, contest?.startTime]);

  const handleRegisterContest = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await registerForContest(id);
      setIsRegistered(true);
    } catch (err) {
      console.error("Error registering for contest:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await unRegisterContest(id);
      setIsRegistered(false);
    } catch (err) {
      console.error("Error unregistering from contest:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leaderboard when contest id changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!id) return;
      setIsLeaderboardLoading(true);
      try {
        const data = await useContestStore.getState().contestLeaderBoard(id);
        setLeaderboard(data || []);
      } catch (err) {
        setLeaderboard([]);
        console.error("Error fetching leaderboard:", err);
      } finally {
        setIsLeaderboardLoading(false);
      }
    };
    fetchLeaderboard();
  }, [id]);

  // Timer for contest remaining time
  const [remainingTime, setRemainingTime] = useState(0);
  useEffect(() => {
    if (!contest?.endTime) return;
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(contest.endTime);
      const diff = end.getTime() - now.getTime();
      setRemainingTime(diff > 0 ? diff : 0);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest?.endTime]);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Pagination state for leaderboard
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(leaderboard.length / pageSize);
  const paginatedLeaderboard = leaderboard.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-base-100 flex justify-center gap-6 p-7 w-[90vw]">
      {/* Main Contest Card */}
      <div className="w-full bg-base-100/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col border border-base-200 hover:border-emerald-500/50 transition-all duration-300">
        {/* Contest Header Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 min-w-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          {isContestLoading ? (
            <div className="flex items-center justify-center h-full z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                <Loader className="w-12 h-12 animate-spin text-emerald-500 relative z-10" />
              </div>
            </div>
          ) : (
            <div className="text-center w-full z-10 space-y-4">
              {/* Contest Title */}
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-base-content break-words leading-tight">
                {contest?.name}
              </h1>
              
              {/* Contest Date & Time */}
              <div className="text-base-content/70 text-lg mb-3 font-medium bg-base-100/50 backdrop-blur-sm inline-block px-6 py-3 rounded-xl border border-base-200">
                <div className="flex items-center gap-2 justify-center">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  {contest?.startTime &&
                    new Date(contest.startTime).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZoneName: "short",
                    })}
                </div>
              </div>
              
              {/* Starts In Countdown */}
              <div className="text-base-content/90 mb-4 text-xl font-semibold">
                <span className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 px-6 py-3 rounded-xl border border-emerald-500/30 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Timer className="w-5 h-5 text-emerald-500" />
                  Starts in <span className="text-emerald-600 font-bold">{startsIn}</span>
                </span>
              </div>
              
              {/* Contest Timer UI */}
              {isContestLive && contest?.endTime && (
                <div className="flex flex-col items-center mb-6">
                  <span className="text-lg font-bold text-emerald-600 mb-2 tracking-wide flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    TIME REMAINING
                  </span>
                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl shadow-2xl text-3xl md:text-4xl font-mono tracking-widest border-2 border-white/20 hover:scale-105 transition-transform duration-300">
                    {formatTime(remainingTime)}
                  </div>
                </div>
              )}
              
              {/* Registration Button */}
              <button
                className={`btn btn-lg px-10 py-3 text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  isRegistered 
                    ? 'bg-red-600 hover:bg-red-500 border-none text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 border-none text-white'
                } ${isLoading ? 'animate-pulse' : ''}`}
                onClick={
                  isRegistered ? handleUnregister : handleRegisterContest
                }
                disabled={
                  isLoading ||
                  (isRegistered && isContestLive)
                }
              >
                {isLoading
                  ? isRegistered
                    ? "Unregistering..."
                    : "Registering..."
                  : isRegistered
                  ? isContestLive
                    ? "Contest Live"
                    : "Unregister"
                  : "Register Now"}
              </button>
              
              {isRegistered && isContestLive && (
                <div className="text-error mt-3 text-sm bg-red-500/10 px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-red-500/30">
                  <AlertCircle className="w-4 h-4" />
                  You cannot unregister after the contest has started.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contest Problems Section */}
        <div className="flex-1 p-6 md:p-12 min-w-0 bg-base-200/50">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-500 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Contest Problems
          </h2>
          {isRegistered && isContestLive ? (
            <div>
              <ContestProblem contestId={id} />
            </div>
          ) : (
            <div className="text-center text-base-content/70 bg-base-100/50 backdrop-blur-sm rounded-xl p-8 border border-base-200">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                <Lock className="w-12 h-12 mx-auto text-emerald-500 relative z-10" />
              </div>
              <p className="text-lg font-medium">
                You must register for the contest and wait for it to go live to view the problems.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="leaderboard w-full bg-base-100/40 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-base-200 hover:border-emerald-500/50 transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-500 flex items-center gap-3">
          <Trophy className="w-8 h-8" />
          Leaderboard
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-xl">
          <table className="table w-full rounded-xl overflow-hidden bg-base-100">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-500/40 to-blue-500/40 text-white text-lg">
                <th className="px-6 py-4 rounded-tl-xl font-bold text-xl">Rank</th>
                <th className="px-6 py-4 font-bold text-xl">User</th>
                <th className="px-6 py-4 rounded-tr-xl font-bold text-xl">Score</th>
              </tr>
            </thead>
            <tbody>
              {isLeaderboardLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                      <Loader className="animate-spin mx-auto w-12 h-12 text-emerald-500 relative z-10" />
                    </div>
                  </td>
                </tr>
              ) : paginatedLeaderboard && paginatedLeaderboard.length > 0 ? (
                paginatedLeaderboard.map((entry, idx) => {
                  const globalRank = (currentPage - 1) * pageSize + idx + 1;
                  const isTopThree = globalRank <= 3;
                  
                  return (
                    <tr
                      key={entry.userId}
                      className={`${
                        idx % 2 === 0
                          ? "bg-base-100 hover:bg-emerald-500/10"
                          : "bg-base-200/50 hover:bg-emerald-500/10"
                      } transition-all duration-300 hover:scale-[1.01] ${
                        isTopThree ? 'border-l-4 border-emerald-500' : ''
                      }`}
                    >
                      <td className={`px-6 py-4 font-bold text-2xl text-center ${
                        isTopThree ? 'text-emerald-600' : 'text-base-content'
                      }`}>
                        <span className="inline-flex items-center gap-2">
                          {globalRank === 1 && <Crown className="w-6 h-6 text-yellow-500" />}
                          {globalRank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                          {globalRank === 3 && <Medal className="w-6 h-6 text-amber-600" />}
                          <span>{globalRank}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        <span className={`inline-block px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                          isTopThree 
                            ? 'bg-gradient-to-r from-emerald-500/30 to-blue-500/30 text-base-content border border-emerald-500/50' 
                            : 'bg-base-200 text-base-content'
                        }`}>
                          {entry.username || entry.userId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600 text-2xl">
                        <span className="inline-block bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30 hover:shadow-lg transition-shadow duration-300">
                          {entry.totalMarks}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-base-content/70">
                    <div className="relative inline-block mb-4">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                      <Users className="w-12 h-12 mx-auto text-emerald-500 opacity-50 relative z-10" />
                    </div>
                    <p className="text-lg">No leaderboard data available.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="btn btn-md bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-2 font-bold text-lg text-emerald-600 px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-md bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterContestPage;