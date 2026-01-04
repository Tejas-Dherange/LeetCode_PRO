import { useForm } from "react-hook-form";
import { useContestStore } from "../store/useContestStore.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  FileText, 
  Save, 
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Check,
  X
} from "lucide-react";

function CreateContestPage() {
  const { createContest } = useContestStore();
  const navigate = useNavigate();
  const { problems, getAllProblemsUnpaginated, loadMoreProblems, pagination, isLoadingMore } = useProblemStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    getAllProblemsUnpaginated();
  }, [getAllProblemsUnpaginated]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      startTime: "",
      endTime: "",
    },
  });


  const onSubmit = async (data) => {
    try {
      // Validate at least one problem is selected
      if (selectedProblems.length === 0) {
        alert(" Please select at least one problem");
        return;
      }

      // Convert marks to int and times to ISO string
      const payload = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        problems: selectedProblems.map((p) => ({
          problemId: p.id,
          marks: parseInt(p.marks) || 0,
        })),
      };
      console.log("Creating contest with payload:", payload);

      await createContest(payload);
      navigate("/dashboard/contest");
      reset();
      setSelectedProblems([]);
    } catch (err) {
      alert(err?.response?.data?.message || "Error creating contest");
    }
  };

  // Filter and sort problems
  const filteredAndSortedProblems = problems
    .filter((problem) => {
      // Search filter
      const matchesSearch = problem.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Difficulty filter
      const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

  // Get selected problem IDs for quick lookup
  const selectedProblemIds = new Set(selectedProblems.map(p => p.id));

  // Helper functions
  const handleAddProblem = (problem) => {
    if (!selectedProblemIds.has(problem.id)) {
      setSelectedProblems([...selectedProblems, { ...problem, marks: 100 }]);
    }
  };

  const handleRemoveProblem = (problemId) => {
    setSelectedProblems(selectedProblems.filter(p => p.id !== problemId));
  };

  const updateProblemMarks = (problemId, marks) => {
    setSelectedProblems(selectedProblems.map(p => 
      p.id === problemId ? { ...p, marks } : p
    ));
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-success/20 text-success border-success/30';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'Hard': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-base-300 text-base-content';
    }
  };

  return (
    <div className="min-h-screen mt-[-150px] pt-[150px] bg-base-100 w-full md:w-[99vw] relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full  px-6 md:px-12 lg:px-20 py-12">
        {/* Navigation */}
       

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-500/20 mb-4">
              <Sparkles className="w-3 h-3" />
              Creator Studio
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-content/60 mb-3 tracking-tight">
              Create New <span className="text-emerald-500">Contest</span>
            </h1>
            <p className="text-lg text-base-content/60">
              Design the perfect coding challenge for your community
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100/40 backdrop-blur-md border border-base-200 rounded-3xl p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
              
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-base-200">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-base-content/80">Contest Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weekly LeetCode Challenge #42"
                      className="input input-bordered w-full bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      {...register("name", { required: "Contest name is required" })}
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-base-content/80">Description</span>
                    </label>
                    <textarea
                      placeholder="Briefly describe what this contest is about..."
                      className="textarea ml-2 textarea-bordered h-12 w-full bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base"
                      {...register("description", { required: "Description is required" })}
                    ></textarea>
                    {errors.description && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.description.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-base-200">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content">Schedule</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-base-content/80">Start Time</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
                      <input
                        type="datetime-local"
                        className="input input-bordered w-full pl-10 bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        {...register("startTime", { required: "Start time is required" })}
                      />
                    </div>
                    {errors.startTime && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.startTime.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-base-content/80">End Time</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
                      <input
                        type="datetime-local"
                        className="input input-bordered w-full pl-10 bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        {...register("endTime", { required: "End time is required" })}
                      />
                    </div>
                    {errors.endTime && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.endTime.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Problems Section */}
            {/* Problems Section - Dual Pane */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-base-200">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content">Problems Selection</h3>
                  <div className="ml-auto text-sm text-base-content/60">
                    {selectedProblems.length} problem{selectedProblems.length !== 1 && 's'} selected
                  </div>
                </div>

                {/* Dual Pane Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* LEFT PANE: Selected Problems */}
                  <div className="lg:col-span-2">
                    <div className="bg-base-200/50 rounded-xl p-4 border border-base-300 min-h-[400px]">
                      <h4 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        Selected Problems ({selectedProblems.length})
                      </h4>
                      
                      {selectedProblems.length === 0 ? (
                        <div className="text-center py-12 text-base-content/50">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">No problems selected yet</p>
                          <p className="text-xs mt-1">Add from the table →</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                          {selectedProblems.map((problem, idx) => (
                            <motion.div
                              key={problem.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-base-100 p-4 rounded-lg border border-base-300 hover:border-emerald-500/50 transition-all group"
                            >
                              {/* Horizontal Layout */}
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex-shrink-0">
                                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 text-sm font-bold">
                                    {idx + 1}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-8 min-w-0 ">
                                  <h5 className="font-semibold text-base text-base-content truncate mb-1">
                                    {problem.title}
                                  </h5>
                                  <span className={`inline-block text-xs px-2 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProblem(problem.id)}
                                  className="btn btn-ghost border-error  ml-24 btn-sm btn-circle text-base-content/40 hover:text-error hover:bg-error/10 flex-shrink-0"
                                  title="Remove"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              
                              {/* Points Input - Full Width */}
                              <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-base-content/70 flex-shrink-0">
                                  Points:
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={problem.marks || ''}
                                  onChange={(e) => updateProblemMarks(problem.id, e.target.value)}
                                  className="input input-sm input-bordered flex-1 bg-base-100 max-w-[120px]"
                                  placeholder="10"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANE: Available Problems Table */}
                  <div className="lg:col-span-3">
                    <div className="bg-base-200/50 rounded-xl p-4 border border-base-300">
                      <h4 className="font-semibold text-base-content mb-4">Available Problems</h4>
                      
                      {/* Search and Filter */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="form-control">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                              type="text"
                              placeholder="Search problems..."
                              className="input input-sm input-bordered w-full pl-10 bg-base-100"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-control">
                          <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
                            <select
                              className="select select-sm select-bordered w-full pl-10 bg-base-100"
                              value={difficultyFilter}
                              onChange={(e) => setDifficultyFilter(e.target.value)}
                            >
                              <option value="all">All Difficulties</option>
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Problems Table */}
                      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-base-300 rounded-lg">
                        <table className="table table-sm table-pin-rows">
                          <thead>
                            <tr className="bg-base-200">
                              <th className="w-12"></th>
                              <th>Problem</th>
                              <th className="w-24">Difficulty</th>
                              <th className="w-24 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAndSortedProblems.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="text-center py-8 text-base-content/50">
                                  No problems found
                                </td>
                              </tr>
                            ) : (
                              filteredAndSortedProblems.map((problem) => {
                                const isSelected = selectedProblemIds.has(problem.id);
                                return (
                                  <tr 
                                    key={problem.id} 
                                    className={`hover:bg-base-300/50 ${isSelected ? 'bg-success/10' : ''}`}
                                  >
                                    <td>
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-success" />
                                      )}
                                    </td>
                                    <td>
                                      <div className="font-medium text-sm">
                                        {problem.title || `Problem ${problem.id}`}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                      </span>
                                    </td>
                                    <td className="text-right">
                                      <button
                                        type="button"
                                        onClick={() => handleAddProblem(problem)}
                                        disabled={isSelected}
                                        className={`btn btn-xs gap-1 ${
                                          isSelected 
                                            ? 'btn-disabled opacity-50' 
                                            : 'btn-ghost text-emerald-500 hover:bg-emerald-500/10'
                                        }`}
                                      >
                                        <Plus className="w-3 h-3" />
                                        {isSelected ? 'Added' : 'Add'}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination Info and Load More */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-base-content/50">
                          Showing {problems.length} of {pagination.total} problem{pagination.total !== 1 && 's'}
                        </div>
                        
                        {pagination.hasMore && (
                          <button
                            type="button"
                            onClick={loadMoreProblems}
                            disabled={isLoadingMore}
                            className="btn btn-xs btn-ghost text-emerald-500 hover:bg-emerald-500/10 gap-1"
                          >
                            {isLoadingMore ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Loading...
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                Load More
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Validation Error */}
                {selectedProblems.length === 0 && (
                  <div className="text-warning text-sm flex items-center gap-2 bg-warning/10 p-3 rounded-lg border border-warning/30">
                    <AlertCircle className="w-4 h-4" />
                    Please select at least one problem for the contest
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <div className="pt-6 border-t border-base-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-block bg-emerald-500 hover:bg-emerald-600 border-none text-white shadow-lg shadow-emerald-500/30 gap-2 h-12 text-lg font-bold tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner text-white"></span>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Contest
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CreateContestPage;
