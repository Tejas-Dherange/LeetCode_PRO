import React, { useState } from "react";
import { useContestStore } from "../store/useContestStore";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ContestsTable({ contests: propContests }) {
  const { contests: storeContests } = useContestStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Use prop contests if provided, otherwise use store contests
  const contests = propContests || storeContests;
  
  // Calculate pagination
  const totalPages = Math.ceil(contests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContests = contests.slice(startIndex, endIndex);

  return (
    <div className=" w-full">
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
          {paginatedContests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-base-content/50">
                No contest history available
              </td>
            </tr>
          ) : (
            paginatedContests.map((contest) => {
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
                <tr 
                  key={contest.id || contest._id} 
                  onClick={() => {
                    // Navigate to detail page if past, otherwise to register
                    if (status === "Past") {
                      navigate(`/dashboard/contest/detail/${contest.id || contest._id}`);
                    } else {
                      navigate(`/dashboard/contest/register/${contest.id || contest._id}`);
                    }
                  }}
                  className="hover:bg-base-200/50 transition-colors border-b border-base-content/5 cursor-pointer"
                > 
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
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-base-content/60">
            Showing {startIndex + 1}-{Math.min(endIndex, contests.length)} of {contests.length} contests
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-ghost gap-1 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${
                    currentPage === page 
                      ? 'btn-primary bg-emerald-500 text-white' 
                      : 'btn-ghost'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-ghost gap-1 disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContestsTable;
