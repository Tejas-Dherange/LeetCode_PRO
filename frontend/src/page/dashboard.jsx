import React, { useEffect, useState } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

function Dashboard() {
  const { isProblemsLoading, problems, getAllProblems } = useProblemStore();

  useEffect(() => {
    // Fetch initial problems with pagination
    getAllProblems(true); // true to reset filters
  }, [getAllProblems]);

  if (isProblemsLoading && problems.length === 0) {
    // Only show loader on initial load, not when loading more
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center mt-14 px-4">
        <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-success opacity-25 blur-3xl rounded-md bottom-9"></div>
        <h1 className="text-5xl font-extrabold z-10 text-center">
          Welcome to <span className="text-success">CodeLoom</span>
        </h1>

        <p className="mt-4 text-center w-3/4 text-lg font-semibold text-gray-500 dark:text-gray-400 z-10">
          A Platform Inspired by Leetcode which helps you to prepare for coding
          interviews and helps you to improve your coding skills by solving
          coding problems
        </p>
        {/* Always render ProblemTable to keep filters visible */}
        <ProblemTable problems={problems} />
      </div>
    </>
  );
}

export default Dashboard;

