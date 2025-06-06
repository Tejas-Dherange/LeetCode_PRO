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

  // console.log(isRegistered, "isRegistered");

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-6 px-2">
      <div className="w-full max-w-6xl bg-base-100 rounded-xl shadow-2xl overflow-hidden flex flex-col ">
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
                You must register for the contest to view the problems.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterContestPage;