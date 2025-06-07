// ...existing imports...
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContestStore } from "../store/useContestStore";
import { Loader } from "lucide-react";
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
    <div className="min-h-screen bg-base-200 flex justify-center gap-5 p-7 w-[90vw]">
      <div className="w-full bg-base-100 rounded-xl shadow-2xl overflow-hidden flex flex-col ">
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 min-w-0">
          {isContestLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="loader">
                <Loader />
              </div>
            </div>
          ) : (
            <div className="text-center w-full">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary break-words">
                {contest?.name}
              </h1>
              <div className="text-gray-500 text-lg mb-2">
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
              <div className="text-base-content/70 mb-2">
                Starts in {startsIn}
              </div>
              {/* Contest Timer UI */}
              {isContestLive && contest?.endTime && (
                <div className="flex flex-col items-center mb-4">
                  <span className="text-lg font-semibold text-success mb-1">
                    Time Remaining
                  </span>
                  <div className="bg-gradient-to-r from-primary to-success text-white px-6 py-2 rounded-full shadow-lg text-2xl font-mono tracking-widest border-2 border-primary animate-pulse">
                    {formatTime(remainingTime)}
                  </div>
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={
                  isRegistered ? handleUnregister : handleRegisterContest
                }
                disabled={
                  isLoading ||
                  (isRegistered && isContestLive) // Disable if contest is live and user is registered
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
                  : "Register"}
              </button>
              {isRegistered && isContestLive && (
                <div className="text-error mt-2">
                  You cannot unregister after the contest has started.
                </div>
              )}
            </div>
          )}
        </div>

        {/* // Contest problems section */}
        <div className="flex-1 p-6 md:p-12 min-w-0 bg-base-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Contest Problems
          </h2>
          {isRegistered && isContestLive ? (
            <ContestProblem contestId={id} />
          ) : (
            <div className="text-center text-base-content/70">
              <p className="mb-4">
                You must register for the contest and contest will be live to view the problems.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="leaderboard w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="table w-full border rounded-xl shadow bg-gradient-to-r from-gray-900 to-gray-800">
            <thead>
              <tr className="bg-gradient-to-r from-primary/30 to-success/30 text-primary-content text-lg">
                <th className="px-6 py-3 rounded-tl-xl">Rank</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3 rounded-tr-xl">Score</th>
              </tr>
            </thead>
            <tbody>
              {isLeaderboardLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <Loader className="animate-spin mx-auto w-8 h-8 text-primary" />
                  </td>
                </tr>
              ) : paginatedLeaderboard && paginatedLeaderboard.length > 0 ? (
                paginatedLeaderboard.map((entry, idx) => (
                  <tr
                    key={entry.userId}
                    className={
                      idx % 2 === 0
                        ? "bg-gray-800/80 hover:bg-primary/10 transition"
                        : "bg-gray-900/80 hover:bg-primary/10 transition"
                    }
                  >
                    <td className="px-6 py-3 font-bold text-xl text-center text-primary-content">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-3 text-center font-semibold">
                      <span className="inline-block bg-primary/20 px-3 py-1 rounded-full text-primary-content">
                        {entry.username || entry.userId}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-success text-lg">
                      {entry.totalMarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-base-content/70">
                    No leaderboard data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="btn btn-sm bg-gradient-to-r from-primary/30 to-success/30 text-primary-content border-none shadow"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-2 font-semibold text-primary-content">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm bg-gradient-to-r from-primary/30 to-success/30 text-primary-content border-none shadow"
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