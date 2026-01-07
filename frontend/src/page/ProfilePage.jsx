import { Link, useNavigate } from "react-router-dom";
import PlaylistProfile from "../components/PlaylistProfile";
import useAuthStore from "../store/useAuthStore";
import Ratings from "../components/Ratings";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowLeft, Mail, User, Shield, Image, Edit, Award, TrendingUp, Calendar, Star, Zap, Target, Home, LogOut, Settings, Sun, Moon, Trophy } from "lucide-react";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import ProfileSubmission from "../components/ProfileSubmission";
import { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import ContributionHeatmap from "../components/ContributionHeatmap";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

const ProfilePage = () => {
  const { authUser, isCheckingAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [contestRatings, setContestRatings] = useState([]);
  const [currentRating, setCurrentRating] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);

  // Theme Logic
  const { theme, setTheme } = useThemeStore();
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const { getUserContestRating } = useContestStore();
  useEffect(() => {
    getUserContestRating(authUser?.id)
      .then((ratings) => {
        if (ratings && ratings.length > 0) {
          setContestRatings(ratings);
          setCurrentRating(ratings[ratings.length - 1].rating);
          setCurrentRank(ratings[ratings.length - 1].rank ?? null);
        } else {
          setContestRatings([]);
          setCurrentRating(null);
          setCurrentRank(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching contest ratings:", error);
        setContestRatings([]);
        setCurrentRating(null);
        setCurrentRank(null);
      });
  }, [authUser?.id]);

  const handleClickEditProfile = () => {
    navigate("/edit-profile");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300">
         <div className="flex gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-0"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-base-300 text-base-content relative overflow-x-hidden selection:bg-emerald-500/30">
        
        {/* Navigation Bar (Immersive) */}
        <nav className="fixed top-0 w-full z-50 bg-base-300/80 backdrop-blur-md border-b border-base-content/5 py-4 px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors group">
                    <div className="p-2 rounded-lg bg-base-content/5 group-hover:bg-emerald-500/10 transition-colors">
                      <Home className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <span className="font-medium hidden md:block">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-base-content/10 hidden md:block"></div>
              </div>

            <div className="flex items-center gap-4">
                 {/* Theme Toggle */}
                 <button
                  onClick={toggleTheme}
                  className="p-2 cursor-pointer rounded-lg hover:bg-base-content/5 text-base-content/60 hover:text-base-content transition-colors"
                  title="Toggle Theme"
                 >
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                 </button>

                 {/* Edit Profile */}
                 <button 
                   onClick={handleClickEditProfile}
                   className="hidden cursor-pointer md:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-semibold border border-emerald-500/20 transition-all"
                 >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                 </button>

                 {/* Mobile Edit Icon */}
                 <button 
                   onClick={handleClickEditProfile}
                   className="md:hidden p-2 rounded-lg hover:bg-base-content/5 text-base-content/60 hover:text-base-content transition-colors"
                 >
                    <Edit className="w-5 h-5" />
                 </button>

                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[2px]">
                    <img 
                      src={authUser?.image || `https://ui-avatars.com/api/?name=${authUser?.name}&background=random`} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-2 border-base-300"
                    />
                 </div>
            </div>
        </nav>

        {/* Ambient Background (Only visible in Dark Mode effectively, but subtle in Light) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--base-content)_1px,transparent_1px),linear-gradient(to_bottom,var(--base-content)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
        </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto relative z-10 pt-28 pb-12 px-6"
      >
        {/* User Identity Header */}
        <motion.div variants={itemVariants} className="mb-12 text-center md:text-left flex flex-col items-center md:flex-row gap-8">
             <div className="relative group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                 <div className="relative w-32 h-32 rounded-full p-1 bg-base-300 ring-4 ring-base-content/5">
                     <img 
                      src={authUser?.image || `https://ui-avatars.com/api/?name=${authUser?.name}&background=random`} 
                      className="w-full h-full rounded-full object-cover" 
                      alt={authUser?.name} 
                    />
                 </div>
             </div>
             
             <div>
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4 mb-2">
                     <h1 className="text-4xl md:text-5xl font-bold text-base-content tracking-tight">{authUser?.name}</h1>
                     <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider">
                        {authUser?.role}
                     </span>
                </div>
                <p className="text-base-content/60 text-lg">{authUser?.email}</p>
                <p className="text-base-content/50 text-sm mt-1">Member since {new Date(authUser?.createdAt).getFullYear()}</p>
             </div>
        </motion.div>

        {/* Master Performance Widget (Unified Cards) */}
        <motion.div variants={itemVariants} className="mb-8">
             <div className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-3xl overflow-hidden shadow-xl">
                {/* Header Section of Widget */}
                <div className="p-8 border-b border-base-content/5 bg-base-100/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                             <h2 className="text-2xl font-bold text-base-content flex items-center gap-2 mb-2">
                                <Target className="w-6 h-6 text-emerald-500" />
                                Performance Command Center
                             </h2>
                             <p className="text-base-content/60">Real-time analysis of your competitive programming journey.</p>
                        </div>
                        
                        {/* KPI Mini-Cards */}
                        <div className="flex flex-wrap gap-4">
                             <div className="flex items-center gap-4 px-6 py-3 bg-base-100/50 rounded-2xl border border-base-content/5 transform hover:scale-105 transition-transform cursor-default">
                                  <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                                      <Trophy className="w-5 h-5" />
                                  </div>
                                  <div>
                                       <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Global Rank</p>
                                       <p className="text-2xl font-bold text-base-content">{currentRank ? `#${currentRank}` : "-"}</p>
                                  </div>
                             </div>

                             <div className="flex items-center gap-4 px-6 py-3 bg-base-100/50 rounded-2xl border border-base-content/5 transform hover:scale-105 transition-transform cursor-default">
                                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                      <Zap className="w-5 h-5" />
                                  </div>
                                  <div>
                                       <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Rating</p>
                                       <p className="text-2xl font-bold text-base-content">{currentRating || "-"}</p>
                                  </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Graph Area */}
                <div className="p-6 md:p-8 bg-black/5 dark:bg-black/20">
                     <div className="h-[350px] w-full">
                        <Ratings contestRatings={contestRatings} />
                     </div>
                </div>
             </div>
        </motion.div>

        {/* Single Column Content Stack */}
        <div className="space-y-8 pb-12">
            
            {/* Heatmap Card */}
            <motion.div variants={itemVariants} className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-3xl p-6 md:p-8 shadow-lg">
                 <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                     <Calendar className="w-5 h-5 text-emerald-500" />
                     Activity Map
                 </h3>
                 <ContributionHeatmap userId={authUser?.id} />
            </motion.div>

            {/* Problems Solved */}
            <motion.div variants={itemVariants} className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-3xl p-6 md:p-8 shadow-lg">
                 <ProblemSolvedByUser />
            </motion.div>
            
            {/* Recent Submissions (Now Full Width) */}
            <motion.div variants={itemVariants} className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-3xl p-6 md:p-8 shadow-lg min-h-[400px]">
                <ProfileSubmission />
            </motion.div>
                 
             {/* Playlists */}
            <motion.div variants={itemVariants} className="bg-base-200/50 backdrop-blur-xl border border-base-content/5 rounded-3xl p-6 md:p-8 shadow-lg">
                <PlaylistProfile />
            </motion.div>

        </div>

      </motion.div>
    </div>
  );
};

export default ProfilePage;
