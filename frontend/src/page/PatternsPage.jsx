import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatternStore } from "../store/usePatternStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Search,
  ArrowLeft,
  Terminal,
  Cpu,
  Zap,
  Activity,
  Box,
  Layers,
  Code2,
  GitGraph,
  Share2,
  Database,
  Globe,
  Lock,
  Server
} from "lucide-react";
import PatternCard from "../components/PatternCard";

const PatternsPage = () => {
  const navigate = useNavigate();
  const { patterns, isLoading, getAllPatterns, recalculateProgress } = usePatternStore();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    getAllPatterns();
  }, [getAllPatterns]);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    const success = await recalculateProgress();
    if (success) {
      await getAllPatterns();
    }
    setIsRecalculating(false);
  };

  // Map pattern names to consistent premium icons
  const getPatternIcon = (patternName) => {
    const name = patternName.toLowerCase();
    if (name.includes("pointer")) return MousePointer2Icon;
    if (name.includes("sliding")) return Activity;
    if (name.includes("merge")) return GitGraph;
    if (name.includes("tree")) return Layers;
    if (name.includes("graph")) return Share2;
    if (name.includes("heap")) return Database;
    if (name.includes("search")) return Search;
    if (name.includes("dynamic")) return Zap;
    if (name.includes("greedy")) return TrendingUp;
    if (name.includes("backtracking")) return Terminal;
    return Code2;
  };

  // Temporary fix for missing icons
  const MousePointer2Icon = Box; 

  const filteredPatterns = patterns.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/30 blur-3xl animate-pulse"></div>
          <Loader className="w-16 h-16 animate-spin text-emerald-500 relative z-10" />
          <p className="mt-4 text-center text-emerald-500/80 font-mono tracking-widest text-sm animate-pulse">LOADING MATRIX...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-emerald-500/30 w-full relative overflow-x-hidden font-sans">
      
      {/* Premium Animated Background - Theme Aware */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Subtle gradient base that works in both light/dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-200/50 to-base-300/30" />
        
        {/* Animated Orbs - Using Emerald/Green Theme */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px]" 
        />
         <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px]" 
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-base-content/60 hover:text-emerald-500 transition-colors duration-300 mb-2 group-hover:-translate-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">BACK TO DASHBOARD</span>
            </button>
             <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-base-content via-base-content/80 to-emerald-600 drop-shadow-sm">
              Patterns
            </h1>
            <p className="text-base-content/60 mt-2 text-lg max-w-lg leading-relaxed">
              Deconstruct complex problems into reusable blueprints. <span className="text-emerald-500/80 font-medium">Master the code.</span>
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto"
          >
             {/* Search Bar */}
            <div className="relative group w-full sm:w-80">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-base-100/50 backdrop-blur-xl border border-base-content/10 rounded-xl px-4 py-3 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:bg-base-100/80">
                <Search className="w-5 h-5 text-base-content/40 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find a pattern..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-base-content placeholder-base-content/40 ml-3 w-full font-medium"
                />
              </div>
            </div>

            {/* Sync Button */}
             <button
                onClick={handleRecalculate}
                disabled={isRecalculating}
                className="relative p-3 rounded-xl bg-base-100/50 border border-base-content/10 hover:bg-base-100 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden"
              >
                 <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <RefreshCw className={`w-5 h-5 text-base-content/40 group-hover:text-emerald-500 relative z-10 ${isRecalculating ? 'animate-spin' : ''}`} />
              </button>
          </motion.div>
        </div>

        {/* Stats Section with Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
           {[
            { label: "Total Patterns", value: patterns.length, icon: BookOpen, color: "text-emerald-500", from: "from-emerald-500/20", to: "to-emerald-900/5" },
            { label: "In Progress", value: patterns.filter(p => p.completedProblems > 0 && p.progress < 100).length, icon: Activity, color: "text-amber-500", from: "from-amber-500/20", to: "to-amber-900/5" },
            { label: "Mastered", value: patterns.filter(p => p.progress === 100).length, icon: Server, color: "text-green-500", from: "from-green-500/20", to: "to-green-900/5" }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="relative p-1 rounded-2xl bg-gradient-to-br from-base-content/5 to-base-content/0 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.from} ${stat.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl`} />
              <div className="relative h-full bg-base-100/40 backdrop-blur-md rounded-xl p-6 border border-base-content/5 flex items-center justify-between group-hover:border-base-content/10 transition-colors">
                 <div>
                   <p className="text-base-content/50 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                   <p className="text-4xl font-mono font-bold text-base-content mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                 </div>
                 <div className={`p-4 rounded-full bg-base-100 ${stat.color} group-hover:bg-base-200 transition-colors`}>
                   <stat.icon className="w-8 h-8" />
                 </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Grid Layout for Cards */}
        {filteredPatterns.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center border border-base-content/5 rounded-3xl bg-base-content/5 backdrop-blur-sm"
          >
             <div className="w-24 h-24 bg-base-200/50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-base-content/30" />
             </div>
             <h3 className="text-2xl font-bold text-base-content">No patterns found</h3>
             <p className="text-base-content/50 mt-2">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPatterns.map((pattern) => (
                <motion.div 
                  key={pattern.id} 
                  variants={item}
                  layout
                >
                  <PatternCard
                    pattern={pattern}
                    icon={getPatternIcon(pattern.name)}
                    onClick={() => navigate(`/patterns/${pattern.slug}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatternsPage;
