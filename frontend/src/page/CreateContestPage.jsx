import { useForm, useFieldArray } from "react-hook-form";
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
  Filter
} from "lucide-react";

function CreateContestPage() {
  const { createContest } = useContestStore();
  const navigate = useNavigate();
  const { problems, getAllProblems } = useProblemStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

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
      problems: [{ problemId: "", marks: "" }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "problems",
  });

  const onSubmit = async (data) => {
    try {
      // Convert marks to int and times to ISO string
      const payload = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        problems: data.problems.map((p) => ({
          ...p,
          marks: parseInt(p.marks),
        })),
      };
      console.log("Creating contest with payload:", payload);

      await createContest(payload);
      navigate("/dashboard/contest");
      reset();
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

  return (
    <div className="min-h-screen mt-[-150px] pt-[150px] bg-base-100 w-full md:w-[99vw] relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-12">
        {/* Navigation */}
       

        <div className="max-w-4xl mx-auto">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
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
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-base-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-base-content">Problems</h3>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost gap-2 text-emerald-500 hover:bg-emerald-500/10"
                    onClick={() => append({ problemId: "", marks: "" })}
                  >
                    <Plus className="w-4 h-4" />
                    Add Problem
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-xl">
                  <div className="form-control">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        placeholder="Search problems by title..."
                        className="input input-bordered w-full pl-10 bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
                      <select
                        className="select select-bordered w-full pl-10 bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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

                <div className="space-y-4">
                  {fields.map((field, idx) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-base-100/60 p-4 rounded-xl border border-base-200 hover:border-base-300 transition-all"
                    >
                      <div className="absolute -left-2 top-4 w-6 h-6 flex items-center justify-center rounded-full bg-base-200 text-xs font-bold text-base-content/50">
                        {idx + 1}
                      </div>

                      <div className="md:col-span-8">
                        <label className="label pt-0">
                          <span className="label-text font-medium text-base-content/70">Select Problem</span>
                        </label>
                        <select
                          className="select select-bordered w-full bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          {...register(`problems.${idx}.problemId`, { required: true })}
                          defaultValue={field.problemId}
                        >
                          <option value="" disabled>Choose a problem from the library</option>
                          {filteredAndSortedProblems.map((problem) => (
                            <option key={problem.id} value={problem.id}>
                              {problem.title || problem.name || `Problem ${problem.id}`} ({problem.difficulty})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="label pt-0">
                          <span className="label-text font-medium text-base-content/70">Points</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="input input-bordered w-full bg-base-100/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          {...register(`problems.${idx}.marks`, { required: true, min: 0 })}
                        />
                      </div>

                      <div className="md:col-span-1 flex items-end justify-center h-full pb-2">
                        <button
                          type="button"
                          className="btn btn-square btn-ghost btn-sm text-base-content/40 hover:text-error hover:bg-error/10 transition-colors"
                          onClick={() => remove(idx)}
                          disabled={fields.length === 1}
                          title="Remove problem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {errors.problems && (
                  <p className="text-error text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> At least one problem is required
                  </p>
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
