import React, { useEffect } from "react";
import Heatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../themes/ContributionHeatmap.css";
import { Tooltip } from "react-tooltip";
import useActivityStore from "../store/useActivityStore";
import { useSubmissionStore } from "../store/useSubmissionStore";

const ContributionHeatmap = ({ userId }) => {
  const { activity, fetchActivity } = useActivityStore();
  const { submissions } = useSubmissionStore();

  useEffect(() => {
    if (userId) {
      fetchActivity(userId);
    }
  }, [userId, fetchActivity, submissions]);

  return (
    <div className="p-4 bg-base-100 rounded-xl shadow border border-base-300">
      <h2 className="font-bold text-lg mb-4 text-base-content">Contribution Activity</h2>

      <div className="contribution-heatmap">
        <Heatmap
          startDate={new Date("2025-01-01")}
          endDate={new Date("2025-12-31")}
          values={activity || []}
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
      <div className="flex items-center justify-between mt-4 text-sm text-base-content/70">
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
