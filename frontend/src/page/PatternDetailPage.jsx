import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePatternStore } from "../store/usePatternStore";
import useAuthStore from "../store/useAuthStore";
import { motion } from "framer-motion";
import {
  Loader,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Trophy,
  Calendar,
  Search,
  Play,
  Code2,
  ArrowLeftRight,
  Zap,
  Move,
  GitMerge,
  RotateCw,
  RefreshCw,
  Network,
  GitBranch,
  Layers,
  Copy,
  Binary,
  ListOrdered,
  Merge,
  Package,
  Workflow,
  TrendingUp,
  Calculator,
  Box
} from "lucide-react";
import AddProblemToPatternModal from "../components/AddProblemToPatternModal";

const PatternDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    currentPattern,
    isPatternLoading,
    getPatternBySlug,
    clearCurrentPattern,
    removeProblemFromPattern,
  } = usePatternStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const getPatternIcon = (patternName) => {
    const name = patternName?.toLowerCase() || "";
    if (name.includes("two pointer")) return ArrowLeftRight;
    if (name.includes("fast") && name.includes("slow")) return Zap;
    if (name.includes("sliding window")) return Move;
    if (name.includes("merge interval")) return GitMerge;
    if (name.includes("cyclic sort")) return RotateCw;
    if (name.includes("reversal") && name.includes("linked")) return RefreshCw;
    if (name.includes("tree bfs")) return Network;
    if (name.includes("tree dfs")) return GitBranch;
    if (name.includes("two heap")) return Layers;
    if (name.includes("subset")) return Copy;
    if (name.includes("binary search")) return Search;
    if (name.includes("bitwise")) return Binary;
    if (name.includes("top k")) return ListOrdered;
    if (name.includes("k-way merge")) return Merge;
    if (name.includes("knapsack")) return Package;
    if (name.includes("topological")) return Workflow;
    if (name.includes("kadane")) return TrendingUp;
    if (name.includes("prefix sum")) return Calculator;
    return Code2;
  };

  const PatternIcon = currentPattern ? getPatternIcon(currentPattern.name) : Code2;

  useEffect(() => {
    if (slug) {
      getPatternBySlug(slug);
    }
    return () => clearCurrentPattern();
  }, [slug]);

  if (isPatternLoading || !currentPattern) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/30 blur-3xl animate-pulse"></div>
          <Loader className="w-16 h-16 animate-spin text-emerald-500 relative z-10" />
          <p className="mt-4 text-center text-emerald-500/80 font-mono tracking-widest text-sm animate-pulse">LOADING DETAILS...</p>
        </div>
      </div>
    );
  }

  const isAdmin = authUser?.role === "ADMIN";

  // Filter problems
  const filteredProblems = currentPattern.problems.filter((problem) => {
    if (filterDifficulty !== "ALL" && problem.difficulty !== filterDifficulty) {
      return false;
    }
    if (filterStatus === "SOLVED" && !problem.isSolved) return false;
    if (filterStatus === "UNSOLVED" && problem.isSolved) return false;
    if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const progressPercentage =
    currentPattern.progress.totalProblems > 0
      ? Math.round(
          (currentPattern.progress.completedProblems /
            currentPattern.progress.totalProblems) *
            100
        )
      : 0;

  const handleRemoveProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to remove this problem from the pattern?")) {
      await removeProblemFromPattern(currentPattern.id, problemId);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "MEDIUM": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "HARD": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-emerald-500/30 w-full relative overflow-x-hidden font-sans">
      
       {/* Premium Animated Background - Theme Aware */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-200/50 to-base-300/30" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8">
        
        {/* Navigation */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-8"
        >
          <button
            onClick={() => navigate("/patterns")}
            className="flex items-center gap-2 text-base-content/60 hover:text-emerald-500 transition-colors duration-300 group w-fit"
          >
            <div className="p-2 rounded-full bg-base-200/50 group-hover:bg-emerald-500/10 transition-colors">
               <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium tracking-wide">Back to Patterns</span>
          </button>
        </motion.div>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Title & Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative group">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative p-6 rounded-2xl bg-base-100/50 backdrop-blur-xl border border-base-content/10 shadow-xl flex items-center justify-center">
                    {PatternIcon && <PatternIcon className="w-12 h-12 text-emerald-500" />}
                 </div>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-base-content via-base-content/90 to-emerald-600 mb-4 drop-shadow-sm">
                  {currentPattern.name}
                </h1>
                <p className="text-lg text-base-content/60 leading-relaxed max-w-3xl">
                  {currentPattern.description}
                </p>
                {currentPattern.link && (
                  <a
                    href={currentPattern.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white font-medium transition-all duration-300 border border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/20 group"
                  >
                    Read Detailed Guide
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Progress Card - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-base-content/5 to-transparent"
          >
            <div className="absolute inset-0 bg-base-100/40 backdrop-blur-xl rounded-3xl" />
            <div className="relative h-full bg-base-100/50 backdrop-blur-md rounded-[22px] p-6 border border-base-content/5 shadow-2xl">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-1">Your Progress</h3>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-base-content">{progressPercentage}%</span>
                      <span className="text-sm font-medium text-emerald-500">Mastery</span>
                   </div>
                </div>
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
              
              <div className="relative h-3 bg-base-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                >
                   <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </motion.div>
              </div>

              <div className="flex justify-between text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                <span>{currentPattern.progress.completedProblems} solved</span>
                <span>{currentPattern.progress.totalProblems} total</span>
              </div>

              {currentPattern.progress.lastSolvedAt && (
                <div className="mt-6 pt-4 border-t border-base-content/5 flex items-center gap-2 text-xs font-medium text-base-content/40">
                  <Calendar className="w-3.5 h-3.5" />
                  Last active: {new Date(currentPattern.progress.lastSolvedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Controls Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 bg-base-100/60 backdrop-blur-xl p-2 rounded-2xl border border-base-content/5 shadow-lg">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input 
                type="text" 
                placeholder="Search problems..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-base-content placeholder-base-content/40 text-sm font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto p-1 overflow-x-auto no-scrollbar">
              <select
                className="select select-sm bg-base-200/50 border-transparent focus:border-emerald-500 rounded-xl text-xs font-medium"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              <select
                className="select select-sm bg-base-200/50 border-transparent focus:border-emerald-500 rounded-xl text-xs font-medium"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="SOLVED">Solved</option>
                <option value="UNSOLVED">Unsolved</option>
              </select>
              
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 border-none text-white rounded-xl gap-2 shadow-lg shadow-emerald-500/20 ml-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Problem
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Problems List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100/40 backdrop-blur-xl border border-base-content/5 rounded-3xl overflow-hidden shadow-2xl"
        >
          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="w-20 h-20 bg-base-200/50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-base-content/30" />
               </div>
               <h3 className="text-xl font-bold text-base-content">No problems found</h3>
               <p className="text-base-content/50 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-content/5 text-base-content/50 text-xs font-bold uppercase tracking-wider">
                    <th className="py-5 pl-8 w-20 bg-base-200/30">Status</th>
                    <th className="py-5 bg-base-200/30">Problem Title</th>
                    <th className="py-5 bg-base-200/30">Difficulty</th>
                    <th className="py-5 bg-base-200/30">Tags</th>
                    <th className="py-5 pr-8 text-right bg-base-200/30">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-content/5">
                  {filteredProblems.map((problem, index) => (
                    <tr key={problem.id} className="group hover:bg-base-content/[0.02] transition-colors">
                      <td className="pl-8 py-4">
                        {problem.isSolved ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm ring-1 ring-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-base-200/50 flex items-center justify-center text-base-content/20 group-hover:bg-base-200 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <Link
                            to={`/problem/${problem.problemId}`}
                            className="font-bold text-base-content hover:text-emerald-500 transition-colors text-lg"
                          >
                            {problem.title}
                          </Link>
                          {problem.link && (
                            <a
                              href={problem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-base-content/40 hover:text-emerald-500 flex items-center gap-1 mt-1 w-fit group/link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              LeetCode Link 
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-base-200/50 text-xs font-medium text-base-content/60 border border-base-content/5">
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-base-200/30 text-xs font-medium text-base-content/40">
                              +{problem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="pr-8 text-right py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/problem/${problem.problemId}`}
                            className="btn btn-sm bg-base-100 hover:bg-emerald-500 hover:text-white border-base-content/10 hover:border-emerald-500/50 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 mr-1" />
                            Solve
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => handleRemoveProblem(problem.problemId)}
                              className="btn btn-sm btn-ghost btn-square text-error/50 hover:text-error hover:bg-error/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Problem Modal */}
      {showAddModal && (
        <AddProblemToPatternModal
          patternId={currentPattern.id}
          initialOrder={currentPattern.problems?.length > 0 
            ? Math.max(...currentPattern.problems.map(p => p.order || 0)) + 1 
            : 1}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default PatternDetailPage;
