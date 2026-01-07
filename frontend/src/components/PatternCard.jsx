import { ChevronRight, CheckCircle2, Trophy, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const PatternCard = ({ pattern, onClick, icon: Icon }) => {
  const progressPercentage = pattern.progress || 0;
  
  // Dynamic color generation based on progress - using Semantic Colors where possible or Tailwind Emeralds
  const getProgressColor = () => {
    if (progressPercentage === 0) return "bg-base-content/20";
    if (progressPercentage < 25) return "bg-error";
    if (progressPercentage < 75) return "bg-warning";
    return "bg-emerald-500";
  };
  
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Glow Effect - Primary/Emerald based */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-green-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${progressPercentage === 100 ? 'from-emerald-400 to-teal-400' : ''}`}></div>
      
      {/* Card Content - Glassmorphism with Base Colors */}
      <div className="relative h-full bg-base-100/60 backdrop-blur-xl hover:bg-base-100/80 border border-base-content/5 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:border-emerald-500/20">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-base-content/5">
            <Icon className={`w-8 h-8 ${progressPercentage === 100 ? 'text-emerald-500' : 'text-base-content'}`} />
          </div>
          {progressPercentage === 100 && (
             <div className="bg-emerald-500/10 p-1.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
             </div>
          )}
        </div>

        {/* Title & Desc */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-emerald-500/80 transition-colors">
            {pattern.name}
          </h3>
          <p className="text-base-content/60 text-sm line-clamp-2 leading-relaxed">
            {pattern.description}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-auto space-y-4">
           {/* Stats */}
           <div className="flex items-center gap-4 text-xs font-medium text-base-content/50">
             <div className="flex items-center gap-1.5 bg-base-200/50 px-2 py-1 rounded-md">
                <Trophy className="w-3.5 h-3.5" />
                <span>{pattern.totalProblems} Problems</span>
             </div>
              {pattern.lastSolvedAt && (
                <div className="flex items-center gap-1.5 bg-base-200/50 px-2 py-1 rounded-md">
                   <Clock className="w-3.5 h-3.5" />
                   <span>Active</span>
                </div>
              )}
           </div>

           {/* Progress Bar */}
           <div className="relative pt-2">
              <div className="flex justify-between items-end mb-1.5 px-0.5">
                 <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Progress</span>
                 <span className={`text-xs font-bold ${progressPercentage === 100 ? 'text-emerald-500' : 'text-base-content/70'}`}>
                    {Math.round(progressPercentage)}%
                 </span>
              </div>
              <div className="h-1.5 w-full bg-base-200 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${getProgressColor()} relative`}
                 >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                 </motion.div>
              </div>
           </div>

           {/* Start Action */}
           <div className="flex items-center text-emerald-500 text-sm font-bold group-hover:translate-x-1 transition-transform duration-300 mt-2">
              {progressPercentage === 100 ? 'Review Pattern' : 'Start Processing'} 
              <ChevronRight className="w-4 h-4 ml-1" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
