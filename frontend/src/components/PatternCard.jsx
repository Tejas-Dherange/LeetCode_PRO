import { ChevronRight, CheckCircle2 } from "lucide-react";

const PatternCard = ({ pattern, onClick, icon: Icon }) => {
  const progressPercentage = pattern.progress || 0;
  
  // Determine progress color
  const getProgressColor = () => {
    if (progressPercentage === 0) return "bg-base-300";
    if (progressPercentage < 25) return "bg-error";
    if (progressPercentage < 75) return "bg-warning";
    return "bg-emerald-500";
  };

  const getProgressTextColor = () => {
    if (progressPercentage === 0) return "text-base-content/50";
    if (progressPercentage < 25) return "text-error";
    if (progressPercentage < 75) return "text-warning";
    return "text-emerald-600";
  };

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-base-200 hover:border-emerald-500/30"
      onClick={onClick}
    >
      <div className="card-body p-6">
        {/* Icon and Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="card-title text-lg font-bold">{pattern.name}</h2>
              <p className="text-sm text-base-content/60 font-medium">
                {pattern.totalProblems} problems
              </p>
            </div>
          </div>
          {progressPercentage === 100 && (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-base-content/70 mb-6 line-clamp-2 min-h-[2.5rem]">
          {pattern.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2 font-medium">
            <span className={getProgressTextColor()}>
              {pattern.completedProblems}/{pattern.totalProblems} completed
            </span>
            <span className={getProgressTextColor()}>
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-auto">
          <div>
            {pattern.lastSolvedAt && (
              <p className="text-xs text-base-content/50 font-medium">
                Last solved: {new Date(pattern.lastSolvedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <button className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none gap-2 px-4">
            Start
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
