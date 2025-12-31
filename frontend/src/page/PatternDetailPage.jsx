import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePatternStore } from "../store/usePatternStore";
import useAuthStore from "../store/useAuthStore";
import { motion } from "framer-motion";
import {
  Loader,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Trophy,
  Target,
  Calendar,
  Filter,
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
  Calculator
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
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader className="size-12 animate-spin text-emerald-500 relative z-10" />
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
      case "EASY": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "MEDIUM": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "HARD": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-base-content/60 bg-base-200";
    }
  };

  return (
    <div className="min-h-screen bg-base-100 w-full relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/patterns")}
          className="btn btn-ghost btn-sm gap-2 mb-8 hover:bg-base-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patterns
        </motion.button>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Title & Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-start gap-6">
              <div className="p-6 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                {PatternIcon && <PatternIcon className="w-16 h-16" />}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-base-content mb-3 tracking-tight">
                  {currentPattern.name}
                </h1>
                <p className="text-lg text-base-content/60 leading-relaxed max-w-2xl">
                  {currentPattern.description}
                </p>
                {currentPattern.link && (
                  <a
                    href={currentPattern.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Read Guide
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100/50 backdrop-blur-md border border-base-200 rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Your Progress
              </h3>
              <span className="text-2xl font-black text-base-content">
                {progressPercentage}%
              </span>
            </div>
            
            <div className="relative h-4 bg-base-200 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              ></motion.div>
            </div>

            <div className="flex justify-between text-sm text-base-content/60 font-medium">
              <span>{currentPattern.progress.completedProblems} solved</span>
              <span>{currentPattern.progress.totalProblems} total</span>
            </div>

            {currentPattern.progress.lastSolvedAt && (
              <div className="mt-6 pt-4 border-t border-base-200 flex items-center gap-2 text-xs text-base-content/40">
                <Calendar className="w-3 h-3" />
                Last active: {new Date(currentPattern.progress.lastSolvedAt).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        </div>

        {/* Controls & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100/50 backdrop-blur-sm p-4 rounded-2xl border border-base-200 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative group w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search problems..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm pl-9 bg-base-100 border-base-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                className="select select-sm select-bordered bg-base-100 w-full md:w-40"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              <select
                className="select select-sm select-bordered bg-base-100 w-full md:w-40"
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
                  className="btn btn-sm btn-primary bg-emerald-500 hover:bg-emerald-600 border-none gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add
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
          className="bg-base-100/50 backdrop-blur-md border border-base-200 rounded-3xl overflow-hidden shadow-xl"
        >
          {filteredProblems.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-base-200/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-base-content/30" />
              </div>
              <h3 className="text-xl font-bold text-base-content/60">No problems found</h3>
              <p className="text-base-content/40 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/50 text-base-content/60 text-sm uppercase tracking-wider border-b border-base-200">
                    <th className="py-4 pl-8 w-20">Status</th>
                    <th className="py-4">Problem</th>
                    <th className="py-4">Difficulty</th>
                    <th className="py-4">Tags</th>
                    <th className="py-4 pr-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {filteredProblems.map((problem, index) => (
                    <tr key={problem.id} className="group hover:bg-base-200/30 transition-colors">
                      <td className="pl-8">
                        {problem.isSolved ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-base-content/20 group-hover:bg-base-300 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                          </div>
                        )}
                      </td>
                      <td>
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
                              className="text-xs text-base-content/40 hover:text-emerald-500 flex items-center gap-1 mt-1 w-fit"
                              onClick={(e) => e.stopPropagation()}
                            >
                              External Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-base-200/50 text-xs font-medium text-base-content/60 border border-base-200">
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-base-200/50 text-xs font-medium text-base-content/40 border border-base-200">
                              +{problem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/problem/${problem.problemId}`}
                            className="btn btn-sm btn-ghost hover:bg-emerald-500/10 hover:text-emerald-600"
                          >
                            Solve
                            <Play className="w-4 h-4" />
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => handleRemoveProblem(problem.problemId)}
                              className="btn btn-sm btn-ghost text-error/50 hover:text-error hover:bg-error/10"
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
