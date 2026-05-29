
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContestStore } from "../store/useContestStore";
import { Loader, Clock, Trophy, AlertCircle, Lock, FileText, Timer, Crown, Medal, Users, Search, Target, Zap } from "lucide-react";
import io from "socket.io-client";
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

  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch leaderboard when contest id, page or search changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!id) return;
      setIsLeaderboardLoading(true);
      try {
        const data = await useContestStore.getState().contestLeaderBoard(id, currentPage, 10, debouncedSearch);
        if (data) {
          setLeaderboard(data.leaderboard || []);
          if (data.pagination) {
            setPagination({
              page: data.pagination.page,
              totalPages: data.pagination.totalPages,
              total: data.pagination.total
            });
          }
        }
      } catch (err) {
        setLeaderboard([]);
        console.error("Error fetching leaderboard:", err);
      } finally {
        setIsLeaderboardLoading(false);
      }
    };
    fetchLeaderboard();
  }, [id, currentPage, debouncedSearch]);

  // WebSocket Connection for Real-time Updates
  useEffect(() => {
    if (!id || !isContestLive) return;

    let socket;
    try {
       // Determine socket URL based on environment (assume same host as API or specific config)
       const socketBase = import.meta.env.MODE === "development"
         ? "http://localhost:3000"
         : (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || "https://api.codeloomhq.me/api/v1");

       // socket.io expects the origin (no /api path). Strip any trailing /api/v1 if present.
       const socketUrl = socketBase.replace(/\/api\/v1\/?$/, "");

       socket = io(socketUrl);

       socket.on("connect", () => {
         console.log("Connected to contest socket");
         socket.emit("joinContest", id);
       });

       socket.on("leaderboardUpdate", (data) => {
         if (data.contestId === id) {
           console.log("Received leaderboard update, refetching...");
           // Only refetch if we are on the first page to avoid disrupting pagination flow for user
           // OR refetch regardless but keep current page
           // For now, let's just trigger the fetch
           useContestStore.getState().contestLeaderBoard(id, currentPage, 10, debouncedSearch)
             .then((data) => {
                if (data) setLeaderboard(data.leaderboard || []);
             });
         }
       });

    } catch (error) {
       console.error("Socket connection error:", error);
    }

    return () => {
      if (socket) {
        socket.emit("leaveContest", id);
        socket.disconnect();
      }
    };
  }, [id, isContestLive, currentPage, debouncedSearch]);

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

  const handleFindMe = async () => {
    if (!id) return;
    try {
      const data = await useContestStore.getState().getMyRankInContest(id);
      if (data && data.page) {
        setCurrentPage(data.page);
        // Optionally clear search to show general leaderboard around user
        setSearchQuery(""); 
      } else {
        // toast.error("You are not ranked in this contest yet");
      }
    } catch (error) {
      console.error("Find Me error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-6">
      <div className="max-w-[2000px] mx-auto flex flex-col lg:flex-row gap-6">
        {/* Main Contest Card */}
        <div className="flex-1 bg-base-200 rounded-2xl shadow-lg overflow-hidden flex flex-col border border-base-300">
          {/* Contest Header Section */}
          <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-base-200 relative">
            
            {isContestLoading ? (
              <div className="flex items-center justify-center h-full z-10 py-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                  <Loader className="w-12 h-12 animate-spin text-emerald-500 relative z-10" />
                </div>
              </div>
            ) : (
              <div className="text-center w-full md:w-[600px] z-10 space-y-6">
                {/* Contest Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-base-content break-words leading-tight px-4">
                  {contest?.name}
                </h1>
                
                {/* Contest Date & Time */}
                <div className="flex justify-center">
                  <div className="text-base-content/70 text-base md:text-lg font-medium bg-base-300/50 px-6 py-3 rounded-lg border border-base-content/10 inline-flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>
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
                    </span>
                  </div>
                </div>
                
                {/* Countdown or Live Timer */}
                {!isContestLive ? (
                  /* Starts In Countdown - Only show when contest hasn't started */
                  <div className="flex justify-center">
                    <div className="bg-base-300 px-8 py-4 rounded-xl border border-base-content/10 inline-flex items-center gap-4 shadow-sm">
                      <div className="flex items-center gap-2 text-base-content/60 text-sm font-medium uppercase tracking-wide">
                        <Timer className="w-4 h-4" />
                        <span>Starts in</span>
                      </div>
                      <div className="text-emerald-600 text-2xl md:text-3xl font-bold font-mono tracking-wide">
                        {startsIn}
                      </div>
                    </div>
                  </div>
                ) : contest?.endTime && (
                  /* Contest Timer UI - Only show when contest is live */
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Live</span>
                    </div>
                    <div className="bg-base-300 px-10 py-6 rounded-xl border border-base-content/10 shadow-md">
                      <div className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 text-center">
                        Time Remaining
                      </div>
                      <div className="text-emerald-600 text-4xl md:text-5xl font-bold font-mono tracking-widest">
                        {formatTime(remainingTime)}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Registration Button */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    className={`btn btn-lg px-12 py-3 text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
                      isRegistered 
                        ? 'bg-red-600 hover:bg-red-500 border-none text-white' 
                        : 'bg-emerald-600 hover:bg-emerald-500 border-none text-white'
                    } ${isLoading ? 'animate-pulse' : ''}`}
                    onClick={isRegistered ? handleUnregister : handleRegisterContest}
                    disabled={isLoading || (isRegistered && isContestLive)}
                  >
                    {isLoading
                      ? isRegistered
                        ? "Unregistering..."
                        : "Registering..."
                      : isRegistered
                      ? isContestLive
                        ? "Registered"
                        : "Unregister"
                      : "Register Now"}
                  </button>
                  
                  {isRegistered && isContestLive && (
                    <div className="text-error text-sm bg-red-500/10 px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-red-500/30">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Cannot unregister after contest starts</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contest Problems Section */}
          <div className="flex-1 p-6 md:p-10 bg-base-200/50">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-500 flex items-center gap-3">
              <FileText className="w-7 h-7" />
              Contest Problems
            </h2>
            {isRegistered && isContestLive ? (
              <div>
                <ContestProblem contestId={id} />
              </div>
            ) : (
              <div className="text-center text-base-content/70 bg-base-100/50 backdrop-blur-sm rounded-xl p-10 border border-base-200">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                  <Lock className="w-12 h-12 mx-auto text-emerald-500 relative z-10" />
                </div>
                <p className="text-base md:text-lg font-medium max-w-md mx-auto">
                  Register for the contest and wait for it to go live to view the problems
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="lg:w-[500px] xl:w-[700px] bg-base-100/40 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-base-200 hover:border-emerald-500/50 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-500 flex items-center gap-3">
            <Trophy className="w-7 h-7" />
            <Trophy className="w-7 h-7" />
            Leaderboard
            <div className="ml-auto flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
               <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest hidden sm:inline-block">Live</span>
            </div>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search user..." 
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            </div>
            {isRegistered && (
              <button 
                className="btn btn-outline gap-2"
                onClick={handleFindMe}
              >
                <Target className="w-4 h-4" />
                Find Me
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl shadow-lg border border-base-300">
            <table className="table w-full bg-base-100">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 text-base-content border-b border-base-300">
                  <th className="px-4 py-3 font-bold text-base">Rank</th>
                  <th className="px-4 py-3 font-bold text-base">User</th>
                  <th className="px-4 py-3 font-bold text-base text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {isLeaderboardLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                        <Loader className="animate-spin mx-auto w-10 h-10 text-emerald-500 relative z-10" />
                      </div>
                    </td>
                  </tr>
                ) : leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((entry, idx) => {
                    const globalRank = entry.rank;
                    const isTopThree = globalRank <= 3;
                    
                    return (
                      <tr
                        key={entry.userId}
                        className={`${
                          idx % 2 === 0
                            ? "bg-base-100"
                            : "bg-base-200/30"
                        } hover:bg-emerald-500/5 transition-colors duration-200 border-b border-base-300 ${
                          isTopThree ? 'border-l-4 border-emerald-500' : ''
                        }`}
                      >
                        <td className={`px-4 py-3 font-semibold text-base ${
                          isTopThree ? 'text-emerald-600' : 'text-base-content'
                        }`}>
                          <div className="flex items-center gap-2">
                            {globalRank === 1 && <Crown className="w-5 h-5 text-yellow-500" />}
                            {globalRank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                            {globalRank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                            <span>{globalRank}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${
                            isTopThree ? 'text-emerald-600 font-semibold' : 'text-base-content'
                          }`}>
                            {entry.username || entry.userId}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-emerald-500/15 text-emerald-600 font-bold px-3 py-1 rounded-lg border border-emerald-500/30 text-base">
                            {entry.totalMarks}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-base-content/60">
                      <div className="relative inline-block mb-3">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                        <Users className="w-10 h-10 mx-auto text-emerald-500 opacity-50 relative z-10" />
                      </div>
                      <p className="text-base">No leaderboard data available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-base-content px-3">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterContestPage;

