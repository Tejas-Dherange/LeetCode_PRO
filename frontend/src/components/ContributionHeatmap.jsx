import React, { useEffect, useState } from "react";
import Heatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../themes/ContributionHeatmap.css";
import { Tooltip } from "react-tooltip";
import useActivityStore from "../store/useActivityStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { CalendarDays, RefreshCw } from "lucide-react";

const ContributionHeatmap = ({ userId }) => {
  const { activity, fetchActivity } = useActivityStore();
  const { submissions } = useSubmissionStore();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Generate array of past 2 years + current year
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    if (userId) {
      fetchActivity(userId);
    }
  }, [userId, fetchActivity, submissions?.length]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivity(userId);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-6 bg-base-100 rounded-xl shadow-lg border border-base-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-base-content">Contribution Activity</h2>
            <p className="text-sm text-base-content/60">Your coding streak</p>
          </div>
        </div>
        
        {/* Year Selector */}
        <div className="flex gap-2 items-center">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-sm btn-ghost hover:btn-primary transition-all"
            title="Refresh activity data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`btn btn-sm transition-all duration-300 ${
                selectedYear === year
                  ? 'btn-primary shadow-lg'
                  : 'btn-ghost hover:btn-primary hover:shadow-md'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="contribution-heatmap">
        <Heatmap
          startDate={new Date(selectedYear, 0, 1)}
          endDate={new Date(selectedYear, 11, 31)}
          values={(activity || [])
            .filter(item => item.date.startsWith(`${selectedYear}`))
            .map(item => ({
              date: new Date(item.date),
              count: item.count
            }))
          }
          classForValue={(value) => {
            if (!value || value.count === 0) return "color-empty";
            if (value.count === 1) return "color-github-1";
            if (value.count === 2) return "color-github-2";
            if (value.count >= 3) return "color-github-3";
            return "color-empty";
          }}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": `${value?.date || "No activity"} — ${value?.count || 0} submissions`
          })}
        />
      </div>

      <Tooltip id="heatmap-tooltip" />
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-6 text-sm text-base-content/70">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-base-300"></div>
          <div className="w-3 h-3 rounded-sm bg-success/30"></div>
          <div className="w-3 h-3 rounded-sm bg-success/60"></div>
          <div className="w-3 h-3 rounded-sm bg-success"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionHeatmap;
