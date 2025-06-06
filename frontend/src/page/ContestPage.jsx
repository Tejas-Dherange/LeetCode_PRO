import "daisyui";
import { useContestStore } from "../store/useContestStore";
import ContestsTable from "../components/ContestsTable";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Loader2 } from "lucide-react";

// Helper to get contest status
function getStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "past";
}

// ContestCard component
function ContestCard({
  id,
  name,
  description,
  startTime,
  endTime,
  banner,
  status,
  onAttempt,
}) {
  const statusMap = {
    live: "badge-success",
    upcoming: "badge-warning",
    past: "badge-neutral",
  };
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 w-full max-w-md mx-auto">
      <figure className="h-40 overflow-hidden rounded-t-xl">
        <img
          src="/weekly1.avif"
          alt={name}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <h2 className="card-title text-lg font-bold">{name}</h2>
          <span className={`badge badge-lg ${statusMap[status]}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-base-content/70 mb-2 line-clamp-2">{description}</p>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(startTime).toLocaleString()} -{" "}
          {new Date(endTime).toLocaleString()}
        </p>
        <button
          className="btn btn-primary btn-sm w-full mt-2"
          disabled={status === "past"}
          onClick={() => navigate(`/dashboard/contest/register/${id}`)}
        >
          {status !== "past" ? "Register" : "View Details"}
        </button>
      </div>
    </div>
  );
}

function ContestPage() {
  const { getAllContests, isContestsLoading, contests } = useContestStore();

  useEffect(() => {
    getAllContests();
  }, [getAllContests]);

  // Group contests by status
  const live = contests.filter(
    (c) => getStatus(c.startTime, c.endTime) === "live",
  );
  const upcoming = contests.filter(
    (c) => getStatus(c.startTime, c.endTime) === "upcoming",
  );
  const past = contests.filter(
    (c) => getStatus(c.startTime, c.endTime) === "past",
  );

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-10 bg-base-200">
      <h1 className="text-4xl font-bold text-center mb-2">
        Welcome to the Contest Page
      </h1>
      <p className="text-lg text-center mb-8">
        Here you can find all the upcoming contests and their details.
      </p>

      {isContestsLoading && (
        <div className="flex items-center justify-center h-screen w-[100vw]">
          <Loader className="size-10 " />
        </div>
      )}

      
      {!isContestsLoading && contests.length === 0 && (
        <div className="alert alert-info">
          No contests found. Please check back later.
        </div>
      )}


      {/* Live Contests */}
      <Section title="Live Contests" data={live} />
      {/* Upcoming Contests */}
      <Section title="Upcoming Contests" data={upcoming} />
      {/* Past Contests */}
      <Section title="Past Contests" data={past} />

      {/* //contest table */}
      <div className="mt-10 ">
        <h1 className="text-3xl font-bold mb-6">Contests</h1>
        <ContestsTable />
      </div>
    </div>
  );
}

function Section({ title, data }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {data.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.slice(0, 3).map((c) => (
            <ContestCard
              key={c.id}
              {...c}
              status={getStatus(c.startTime, c.endTime)}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No contests found.</div>
      )}
    </section>
  );
}

export default ContestPage;
