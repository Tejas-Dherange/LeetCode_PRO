import React, { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";

function ContestsTable() {
  const { contests, isContestsLoading, getAllContests } = useContestStore();
//   const [Contests, setContests] = useState([]);

  useEffect(() => {
    getAllContests();
  }, [])
  

  console.log("ContestsTable - contests:", contests);

  return (
    <div>
      {isContestsLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => {
                const now = new Date();
                const start = new Date(contest.startTime);
                const end = new Date(contest.endTime);
                let status = "Upcoming";
                let statusColor = "badge-warning";
                if (now >= start && now <= end) {
                  status = "Live";
                  statusColor = "badge-success";
                } else if (now > end) {
                  status = "Past";
                  statusColor = "badge-neutral";
                }
                return (
                  <tr key={contest.id} className="hover flex-row justify-center items-center"> 
                    <td>{contest.name}</td>
                    <td>{start.toLocaleString().split(',')[0]}</td>
                    <td>{start.toLocaleString().split(',')[1]}</td>
                    <td className={`badge ${statusColor} mt-2`}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContestsTable;
