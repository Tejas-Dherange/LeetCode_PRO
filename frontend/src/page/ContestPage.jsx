import "daisyui";
import { useContestStore } from "../store/useContestStore";
import ContestsTable from "../components/ContestsTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader, 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  Zap,
  Target,
  Search
} from "lucide-react";

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
  
  const filteredContests = contests.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isContestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader className="size-12 animate-spin text-emerald-500 relative z-10" />
        </div>
      </div>
    );
  }

  const liveFiltered = filteredContests.filter(c => getStatus(c.startTime, c.endTime) === "live");
  const upcomingFiltered = filteredContests.filter(c => getStatus(c.startTime, c.endTime) === "upcoming");

  return (
    <div className="min-h-screen bg-base-100 w-[99vw] mt-[-150px] pt-32 relative overflow-hidden">
      {/* Background Blobs only (Removed Grid) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-12">
        
        {/* Removed Back Button */}

        {/* Header Section */}
        {/* Header Section */}
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto px-4"
          >
            <h1 className="text-3xl md:text-3xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-base-content via-base-content/80 to-base-content/60 mb-4 tracking-tight drop-shadow-sm">
              Code. 
              <span className="text-emerald-500 pl-4">Compete. Conquer.</span>
            </h1>
            <p className="text-xl md:text-lg text-base-content/60 leading-relaxed max-w-3xl mx-auto font-medium">
              Challenge yourself, compete with others, and improve your programming skills through intense coding battles.
            </p>
          </motion.div>
        </div>

        {/* Stats HUD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            { 
              title: "Live Contests", 
              value: live.length, 
              icon: Zap, 
              color: "text-emerald-500", 
              bg: "bg-emerald-500/10",
              desc: "Happening now"
            },
            { 
              title: "Upcoming", 
              value: upcoming.length, 
              icon: Target, 
              color: "text-blue-500", 
              bg: "bg-blue-500/10",
              desc: "Get ready"
            },
            { 
              title: "Total Contests", 
              value: contests.length, 
              icon: Trophy, 
              color: "text-purple-500", 
              bg: "bg-purple-500/10",
              desc: "All time"
            }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden group bg-base-100/40 backdrop-blur-md border border-base-200 hover:border-emerald-500/50 p-4 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className={`absolute  -right-8 -top-8 w-40 h-40 rounded-full ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="flex items-start p-2 justify-between relative z-10">
                <div>
                  <p className="text-base font-bold text-base-content/40 mb-2 uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-5xl font-black text-base-content tracking-tighter mb-2">{stat.value}</h3>
                  <p className="text-sm font-medium text-base-content/40 bg-base-200/50 inline-block px-3 py-1 rounded-full">{stat.desc}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filters Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
           <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
              Explore Contests
           </h2>
           <div className="relative w-full md:w-[400px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search contests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-12 h-12 bg-base-100/50 backdrop-blur-sm border-base-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all rounded-xl shadow-sm"
              />
            </div>
        </div>

        {/* Contest Sections */}
        <div className="space-y-16">
          {live.length > 0 && (
            <Section title="Live Contests" data={liveFiltered} />
          )}
          
          <Section title="Upcoming Contests" data={upcomingFiltered} showEmpty={true} />
        </div>

        {/* Contest History Table */}
        {contests.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-base-100/40 backdrop-blur-md border border-base-200 rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-emerald-500 flex items-center gap-3">
              <Trophy className="w-7 h-7" />
              Contest History
            </h2>
            <ContestsTable />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Section({ title, data, showEmpty = false }) {
  if (!data.length && !showEmpty) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-emerald-500 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
        {title}
      </h2>
      {data.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {data.map((c) => (
              <motion.div 
                key={c.id} 
                variants={item}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ContestCard
                  {...c}
                  status={getStatus(c.startTime, c.endTime)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-base-100/50 backdrop-blur-sm rounded-3xl border border-base-200 border-dashed"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
            <Calendar className="w-12 h-12 mx-auto mb-4 text-emerald-500 relative z-10" />
          </div>
          <h3 className="text-xl font-bold text-base-content">No {title.toLowerCase()} found</h3>
          <p className="text-base-content/50 mt-2">Check back later for new contests</p>
        </motion.div>
      )}
    </section>
  );
}

function ContestCard({ id, name, description, startTime, endTime, status }) {
  const statusConfig = {
    live: { 
      bg: "bg-emerald-500/10", 
      text: "text-emerald-600",
      border: "border-emerald-500/20",
      badge: "Live Now",
      buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
      buttonText: "Join Contest"
    },
    upcoming: { 
      bg: "bg-blue-500/10", 
      text: "text-blue-600",
      border: "border-blue-500/20",
      badge: "Upcoming",
      buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white", // Changed to emerald as requested "proper colors" often implies main action color
      buttonText: "Register Now"
    },
    past: { 
      bg: "bg-base-200", 
      text: "text-base-content/60",
      border: "border-base-300",
      badge: "Ended",
      buttonClass: "btn-ghost border border-base-300 hover:bg-base-200",
      buttonText: "View Details"
    },
  };
  
  const config = statusConfig[status];
  const navigate = useNavigate();
  
  return (
    <div className="group relative flex flex-col h-full bg-base-100/40 backdrop-blur-md border border-base-200 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${config.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="p-6 md:p-7 relative z-10 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-base-content group-hover:text-emerald-500 transition-colors mb-2 line-clamp-2">
              {name}
            </h3>
            <span className={`inline-block ${config.bg} ${config.text} border ${config.border} text-xs font-bold px-3 py-1 rounded-full`}>
              {config.badge}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${config.bg} ${config.text} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            <Trophy className="w-6 h-6" />
          </div>
        </div>
        
        {/* Description */}
        <p className="text-base-content/70 text-sm mb-5 line-clamp-2 leading-relaxed flex-grow">
          {description}
        </p>
        
        {/* Info */}
        <div className="space-y-2.5 mb-6 text-sm text-base-content/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-base-content/70">{new Date(startTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-base-content/70">{new Date(endTime).toLocaleString()}</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <button
          className={`${config.buttonClass} cursor-pointer w-full py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none`}
          disabled={status === "past"}
          onClick={() => navigate(`/dashboard/contest/register/${id}`)}
        >
          {config.buttonText}
        </button>
      </div>
    </div>
  );
}

export default ContestPage;
