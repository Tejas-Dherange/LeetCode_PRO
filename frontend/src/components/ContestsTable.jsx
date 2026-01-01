import React from "react";
import { useContestStore } from "../store/useContestStore";
import { Calendar, Clock } from "lucide-react";

function ContestsTable() {
  const { contests } = useContestStore();

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr className="text-base-content/60 border-b border-base-content/10">
            <th className="bg-transparent text-sm uppercase tracking-wider font-semibold">Name</th>
            <th className="bg-transparent text-sm uppercase tracking-wider font-semibold">Start Date</th>
            <th className="bg-transparent text-sm uppercase tracking-wider font-semibold">End Date</th>
            <th className="bg-transparent text-sm uppercase tracking-wider font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="text-base-content/80">
          {contests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-base-content/50">
                No contest history available
              </td>
            </tr>
          ) : (
            contests.map((contest) => {
              const now = new Date();
              const start = new Date(contest.startTime);
              const end = new Date(contest.endTime);
              let status = "Upcoming";
              let statusClass = "bg-blue-500/10 text-blue-500 border-blue-500/20";
              
              if (now >= start && now <= end) {
                status = "Live";
                statusClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
              } else if (now > end) {
                status = "Past";
                statusClass = "bg-base-300/50 text-base-content/50 border-base-300";
              }

              return (
                <tr key={contest.id || contest._id} className="hover:bg-base-200/50 transition-colors border-b border-base-content/5"> 
                  <td className="font-medium text-base py-4">{contest.name}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-base-content/40" />
                      {start.toLocaleDateString()} 
                      <span className="text-xs opacity-60 ml-1">{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-base-content/40" />
                      {end.toLocaleDateString()}
                      <span className="text-xs opacity-60 ml-1">{end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContestsTable;
