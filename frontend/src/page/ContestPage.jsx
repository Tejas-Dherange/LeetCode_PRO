import "daisyui";
import { useContestStore } from "../store/useContestStore";
import ContestsTable from "../components/ContestsTable";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Trophy, Calendar, Clock, Users } from "lucide-react";

// Helper to get contest status
function getStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "past";
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
    <div className="min-h-screen w-full bg-gradient-to-b from-base-100/50 to-base-200/30 dark:from-base-100 dark:to-base-200">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
            Competitive Programming Contests
          </h1>
          <p className="text-base md:text-lg text-base-content/70 mt-4 max-w-4xl mx-auto">
            Participate in our coding contests to challenge yourself and compete with others.
            Solve algorithmic problems and improve your programming skills.
          </p>
        </div>

        {isContestsLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {!isContestsLoading && contests.length === 0 && (
          <div className="alert alert-info shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>No contests scheduled at the moment. Please check back later.</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Live Contests */}
          <Section title="Live Contests" data={live} />

          {/* Upcoming Contests */}
          <Section title="Upcoming Contests" data={upcoming} />
          
          {/* Uncomment for Past Contests */}
          {/* <Section title="Past Contests" data={past} /> */}
        </div>

        {/* Contest Table */}
        <div className="mt-16 bg-base-100 rounded-xl shadow-xl p-4 md:p-6 backdrop-blur-sm border border-base-300">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-primary">
            Contest History
          </h2>
          <ContestsTable />
        </div>
      </div>
    </div>
  );
}

function Section({ title, data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const totalPages = Math.ceil(data.length / cardsPerPage);

  const getCurrentPageData = () => {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return data.slice(start, end);
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-500">
        <span className="w-2 h-8 bg-primary rounded-full"></span>
        {title}
      </h2>
      {data.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {getCurrentPageData().map((c) => (
              <ContestCard
                key={c.id}
                {...c}
                status={getStatus(c.startTime, c.endTime)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join bg-base-100 dark:bg-base-200 shadow-lg">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`join-item btn ${
                      currentPage === index + 1 
                        ? 'btn-primary' 
                        : 'btn-ghost hover:text-primary'
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="alert bg-base-200 text-base-content shadow-lg border border-base-300">
          <Calendar className="w-5 h-5" />
          <span>No {title.toLowerCase()} found at the moment.</span>
        </div>
      )}
    </section>
  );
}

function ContestCard({ id, name, description, startTime, endTime, status }) {
  const statusMap = {
    live: "bg-success text-white",
    upcoming: "bg-warning text-white",
    past: "bg-neutral text-white",
  };
  const navigate = useNavigate();
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="card-body p-6 border-2 border-base-300 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="card-title text-xl font-bold text-primary">
              {name}
            </h2>
            <span className={`badge ${statusMap[status]} mt-2`}>
              {status.toUpperCase()}
            </span>
          </div>
          <Trophy className="w-8 h-8 text-warning opacity-80" />
        </div>
        
        <p className="text-base-content/70 my-4 line-clamp-2">{description}</p>
        
        <div className="flex flex-col gap-2 text-sm text-base-content/60 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Starts: {new Date(startTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Ends: {new Date(endTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Participants: 0</span>
          </div>
        </div>
        
        <button
          className={`btn ${
            status === "live" 
              ? "btn-success" 
              : "btn-primary"
          } w-full hover:scale-[1.02] transition-transform`}
          disabled={status === "past"}
          onClick={() => navigate(`/dashboard/contest/register/${id}`)}
        >
          {status === "live" ? "Join Now" : status === "upcoming" ? "Register" : "View Details"}
        </button>
      </div>
    </div>
  );
}

export default ContestPage;
