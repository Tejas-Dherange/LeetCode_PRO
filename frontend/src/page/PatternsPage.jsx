import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatternStore } from "../store/usePatternStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader, 
  BookOpen, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2,
  MousePointer2,
  Rabbit,
  Maximize,
  Combine,
  RotateCw,
  RefreshCcw,
  Network,
  GitGraph,
  Layers,
  Copy,
  Search,
  Binary,
  ListOrdered,
  Merge,
  ShoppingBag,
  ListTree,
  Code2,
  ArrowLeftRight,
  ArrowLeft,
  Gauge,
  Sparkles,
  Trophy,
  Target
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
      await getAllPatterns(); // Refresh patterns
    }
    setIsRecalculating(false);
  };

  // Map pattern names to Lucide icons
  const getPatternIcon = (patternName) => {
    const name = patternName.toLowerCase();
    if (name.includes("two pointer")) return ArrowLeftRight;
    if (name.includes("fast") && name.includes("slow")) return Rabbit;
    if (name.includes("sliding window")) return Maximize;
    if (name.includes("merge interval")) return Combine;
    if (name.includes("cyclic sort")) return RotateCw;
    if (name.includes("reversal") && name.includes("linked")) return RefreshCcw;
    if (name.includes("tree bfs")) return Network;
    if (name.includes("tree dfs")) return GitGraph;
    if (name.includes("two heap")) return Layers;
    if (name.includes("subset")) return Copy;
    if (name.includes("binary search")) return Search;
    if (name.includes("bitwise")) return Binary;
    if (name.includes("top k")) return ListOrdered;
    if (name.includes("k-way merge")) return Merge;
    if (name.includes("knapsack")) return ShoppingBag;
    if (name.includes("topological")) return ListTree;
    if (name.includes("kadane")) return TrendingUp;
    if (name.includes("prefix sum")) return Code2;
    return Code2; // Default icon
  };

  const filteredPatterns = patterns.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader className="size-12 animate-spin text-emerald-500 relative z-10" />
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-base-100 w-full relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-12">
        
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="btn btn-ghost btn-sm gap-2 mb-8 hover:bg-base-200/50 text-base-content/60"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                Pro Learning Path
              </span>
              <span className="px-3 py-1 rounded-full bg-base-200 text-base-content/60 text-xs font-bold uppercase tracking-wider border border-base-300">
                v2.0
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-content/60 mb-4 tracking-tight">
              Master the 
              <span className="text-emerald-500 pl-2"> Patterns.</span>
            </h1>
            <p className="text-xl text-base-content/60 leading-relaxed">
              Don't just solve problems. Recognize the underlying patterns and unlock the ability to solve any algorithmic challenge.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-end gap-4 w-full lg:w-auto"
          >
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full lg:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search patterns..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10 bg-base-100/50 backdrop-blur-sm border-base-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
              <button
                onClick={handleRecalculate}
                disabled={isRecalculating}
                className="btn btn-square btn-outline border-base-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                title="Sync Progress"
              >
                <RefreshCw className={`w-5 h-5 ${isRecalculating ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats HUD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { 
              title: "Total Patterns", 
              value: patterns.length, 
              icon: BookOpen, 
              color: "text-purple-500", 
              bg: "bg-purple-500/10",
              desc: "Curated paths"
            },
            { 
              title: "In Progress", 
              value: patterns.filter((p) => p.completedProblems > 0 && p.progress < 100).length, 
              icon: Target, 
              color: "text-blue-500", 
              bg: "bg-blue-500/10",
              desc: "Active learning"
            },
            { 
              title: "Mastered", 
              value: patterns.filter((p) => p.progress === 100).length, 
              icon: Trophy, 
              color: "text-emerald-500", 
              bg: "bg-emerald-500/10",
              desc: "Completed paths"
            }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden group bg-base-100/40 backdrop-blur-md border border-base-200 hover:border-base-300 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              onMouseEnter={() => setHoveredStat(idx)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-base-content/50 mb-1">{stat.title}</p>
                  <h3 className="text-4xl font-black text-base-content tracking-tight">{stat.value}</h3>
                  <p className="text-xs font-medium text-base-content/40 mt-2">{stat.desc}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Patterns Grid */}
        {filteredPatterns.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-base-100/50 backdrop-blur-sm rounded-3xl border border-base-200 border-dashed"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <Search className="w-16 h-16 mx-auto mb-6 text-emerald-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-base-content">No patterns found</h3>
            <p className="text-base-content/50 mt-2">Try adjusting your search terms</p>
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
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
