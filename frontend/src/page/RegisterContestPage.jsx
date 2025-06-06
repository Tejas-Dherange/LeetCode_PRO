import { useEffect, useState } from "react";
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

  useEffect(() => {
    getContestById(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    isRegisteredForContest(id)
      .then((registered) => {
        setIsRegistered(registered);
      })
      .catch((error) => {
        console.error("Error checking registration status:", error);
        setIsRegistered(false);
      });
  }, [id]); // Only depend on id

  // Timer state and effect
  const [startsIn, setStartsIn] = useState("");

  function getStartsIn() {
    if (!contest || !contest.startTime) return "-";
    const now = new Date();
    const start = new Date(contest.startTime); // Handles ISO 8601 like 2025-06-08T09:30:00.000Z
    const diff = start - now;
    return diff > 0 ? msToTime(diff) : "Started";
  }

  useEffect(() => {
    if (!contest || !contest.startTime) return;
    setStartsIn(getStartsIn());
    const interval = setInterval(() => {
      setStartsIn(getStartsIn());
    }, 1000);
    return () => clearInterval(interval);
  }, [contest && contest.startTime]);

  function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      days = Math.floor(duration / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  const handleRegisterContest = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await registerForContest(id);
      const registered = await isRegisteredForContest(id);
      setIsRegistered(registered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await unRegisterContest(id);
      const registered = await isRegisteredForContest(id);
      setIsRegistered(registered);
    } finally {
      setIsLoading(false);
    }
  };

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
                disabled={isLoading}
              >
                {isLoading
                  ? isRegistered
                    ? "Unregistering..."
                    : "Registering..."
                  : isRegistered
                  ? "Unregister"
                  : "Register"}
              </button>
            </div>
          )}
        </div>

        {/* // Contest details section */}
        <div className="flex-1 p-6 md:p-12 min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 break-words">
            {contest?.name}
          </h2>
          <div className="mb-4">
            <span className="badge badge-info mr-2">Register</span>
          </div>
          <p className="mb-4 text-base-content/80 text-lg">
            {contest?.description}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">⭐ Bonus Prizes⭐</h3>
          <ul className="list-disc list-inside mb-4 text-base-content/70">
            <li>Contestants ranked 1st ~ 3rd will win a Codeloom Backpack</li>
            <li>
              Contestants ranked 4th ~ 10th will win a Codeloom Water Bottle
            </li>
            <li>
              Contestants ranked 37th, 43rd, 137th, 437th, 443rd, 1024th,
              1337th, and 2048th will win a Codeloom Big O Notebook
            </li>
            <li>
              Only Codeloom.com accounts are eligible for the bonus rewards.
              After the ranking is finalized, a Codeloom team member will reach
              out to you through email regarding the gift!
            </li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">Important Note</h3>
          <ul className="list-disc list-inside mb-4 text-base-content/70">
            <li>
              The penalty time of 5 minutes will be applied for each wrong
              submission.
            </li>
            <li>
              To ensure the fairness of the contest, Codeloom will hide some
              test cases during the contest. When users submit incorrect
              submissions, Codeloom will not show the hidden test cases to the
              users.
            </li>
            <li>
              The final rating of this contest will be updated within 5 working
              days after the contest.
            </li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">
            Contest Violations
          </h3>
          <ul className="list-disc list-inside mb-4 text-base-content/70">
            <li>
              One user submitting with multiple accounts during a contest.
              Codeloom.com account and Codeloom-cn.com account are considered to
              be separate accounts, even if both accounts belong to the same
              user.
            </li>
            <li>
              Multiple accounts submitting similar code for the same problem.
            </li>
            <li>
              Creating unwanted disturbances which interrupt other users'
              participation in a contest.
            </li>
            <li>
              Disclosing contest solutions in public discuss posts before the
              end of a contest.
            </li>
            <li>
              The use of code generation tools or any external assistance for
              solving problems is strictly prohibited. This includes, but is not
              limited to, actions such as inputting problem statements, test
              cases, or solution code into external assistance tools.
            </li>
          </ul>
          <div className="mb-4 text-base-content/70">
            Codeloom heavily emphasizes on the justice and fairness of our
            contests. We have absolutely ZERO TOLERANCE for violation behaviors
            (such as plagiarism, cheating, etc). When a user is deemed violating
            contest rules, we will apply the following penalties on this user:
            <ul className="list-disc list-inside mt-2">
              <li>
                First violation: Contest score resets to zero, CodeloomCoin
                amount resets to zero and a contest and discuss ban for 1 month.
              </li>
              <li>
                Second violation: Contest score resets to zero and permanent
                account deactivation without appeal.
              </li>
            </ul>
          </div>
          <div className="mb-4 text-base-content/70">
            Furthermore, we encourage all participants to contribute to
            maintaining the justice and fairness of our contest. Users who
            submit valid violation report(s) will earn additional CodeloomCoins:
            <ul className="list-disc list-inside mt-2">
              <li>
                For each violating participant, the first 10 users who submit
                the violation report towards this participant will each earn 20
                CodeloomCoins.
              </li>
              <li>
                Each user can earn up to 100 CodeloomCoins for reporting
                violations in a contest.
              </li>
              <li>
                Users will not be rewarded CodeloomCoins for reports on
                Codeloom-cn users.
              </li>
            </ul>
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2">Announcement</h3>
          <div className="mb-4 text-base-content/80">
            Users must register to participate. We hope you enjoy this contest!
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2">Prize</h3>
          <ul className="list-disc list-inside mb-4 text-base-content/70">
            <li>1st: 5,000 CodeloomCoin</li>
            <li>2nd: 2,500 CodeloomCoin</li>
            <li>3rd: 1,000 CodeloomCoin</li>
            <li>4 - 50th: 300 CodeloomCoin</li>
            <li>51 - 100th: 100 CodeloomCoin</li>
            <li>101 - 200th: 50 CodeloomCoin</li>
            <li>Participate: 5 CodeloomCoin</li>
            <li>First Time Participant: 200 CodeloomCoin</li>
            <li>
              Participate Biweekly + Weekly Contests in Same Week: 35
              CodeloomCoin
            </li>
          </ul>
          <div className="mb-4 text-base-content/70">
            Want millions of Codeloom users to recognize your company? Contact
            us to sponsor a contest!
          </div>
          <Link
            to="/dashboard/contest"
            className="btn btn-outline btn-secondary btn-lg w-full sm:w-auto mt-4"
          >
            Back to Contests
          </Link>
        </div>

        {/* // Contest problems section */}
        <div className="flex-1 p-6 md:p-12 min-w-0 bg-base-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Contest Problems
          </h2>
          {isRegistered ? (
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
