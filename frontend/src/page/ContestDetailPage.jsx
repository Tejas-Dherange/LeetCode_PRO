import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContestStore } from "../store/useContestStore";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trophy,
  Code,
  Loader
} from "lucide-react";

function ContestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContestById, getAllProblemsInContest, isContestLoading, contest } = useContestStore();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchContestData = async () => {
      await getContestById(id);
      const contestProblems = await getAllProblemsInContest(id);
      setProblems(contestProblems || []);
    };
    
    fetchContestData();
  }, [id, getContestById, getAllProblemsInContest]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-success/20 text-success border-success/30';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'Hard': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-base-300 text-base-content';
    }
  };

  if (isContestLoading || !contest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader className="size-12 animate-spin text-emerald-500 relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/contest")}
          className="flex items-center gap-2 text-base-content/60 hover:text-emerald-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Contests</span>
        </button>

        <div className="max-w-5xl mx-auto">
          {/* Contest Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100/40 backdrop-blur-md border border-base-200 rounded-3xl p-8 mb-8 shadow-xl"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Trophy className="w-10 h-10" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-base-content mb-4">
                  {contest.name}
                </h1>
                <p className="text-base-content/70 mb-6 leading-relaxed">
                  {contest.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
                  <div className="flex items-center gap-2 bg-base-200/50 px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Started: {new Date(contest.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-base-200/50 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>Ended: {new Date(contest.endTime).toLocaleString()}</span>
                  </div>
                  <div className="bg-base-200 text-base-content/60 px-4 py-2 rounded-lg font-semibold">
                    Status: Ended
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Problems Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                Problems ({problems.length})
              </h2>
            </div>

            {problems.length === 0 ? (
              <div className="text-center py-20 bg-base-100/50 backdrop-blur-sm rounded-3xl border border-base-200 border-dashed">
                <Code className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-xl font-bold text-base-content">No problems found</h3>
                <p className="text-base-content/50 mt-2">This contest doesn't have any problems yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <motion.div
                    key={problem.problemId || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-base-100/40 backdrop-blur-md border border-base-200 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-base-content/50">
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-base-content group-hover:text-emerald-500 transition-colors">
                            {problem.title || problem.name || ` ${problem.problem.title}`}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-sm font-medium text-base-content/60">
                            Points: <span className="text-emerald-500 font-bold">{problem.marks}</span>
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/problem/${problem.problemId}`)}
                        className="btn bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Code className="w-4 h-4" />
                        Solve Problem
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ContestDetailPage;
