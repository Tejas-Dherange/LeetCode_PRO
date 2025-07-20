import React, { useState } from "react";
import {
  ChevronRight,
  Building2,
  FileText,
  Code,
  Clock,
  CheckCircle,
  Circle,
  Star,
  ExternalLink,
  Search,
  Filter,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const SheetsPage = () => {
  const [selectedSheet, setSelectedSheet] = useState("google");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Mock data for company sheets
  const companySheets = {
    google: {
      name: "Google",
      color: "bg-blue-500",
      problems: [
        {
          id: 1,
          title: "Two Sum",
          difficulty: "Easy",
          status: "solved",
          tags: ["Array", "Hash Table"],
          description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
        },
        {
          id: 2,
          title: "Longest Substring Without Repeating Characters",
          difficulty: "Medium",
          status: "attempted",
          tags: ["String", "Sliding Window"],
          description:
            "Given a string s, find the length of the longest substring without repeating characters.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(min(m,n))",
        },
        {
          id: 3,
          title: "Median of Two Sorted Arrays",
          difficulty: "Hard",
          status: "unsolved",
          tags: ["Array", "Binary Search"],
          description:
            "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
          timeComplexity: "O(log(min(m,n)))",
          spaceComplexity: "O(1)",
        },
        {
          id: 4,
          title: "Container With Most Water",
          difficulty: "Medium",
          status: "attempted",
          tags: ["Array", "Two Pointers"],
          description:
            "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
        },
        {
          id: 5,
          title: "Regular Expression Matching",
          difficulty: "Hard",
          status: "unsolved",
          tags: ["String", "Dynamic Programming"],
          description:
            "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
          timeComplexity: "O(m*n)",
          spaceComplexity: "O(m*n)",
        },
      ],
    },
    microsoft: {
      name: "Microsoft",
      color: "bg-green-500",
      problems: [
        {
          id: 4,
          title: "Reverse Linked List",
          difficulty: "Easy",
          status: "solved",
          tags: ["Linked List", "Recursion"],
          description:
            "Given the head of a singly linked list, reverse the list, and return the reversed list.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
        },
        {
          id: 5,
          title: "Design LRU Cache",
          difficulty: "Medium",
          status: "unsolved",
          tags: ["Hash Table", "Linked List", "Design"],
          description:
            "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
          timeComplexity: "O(1)",
          spaceComplexity: "O(capacity)",
        },
      ],
    },
    amazon: {
      name: "Amazon",
      color: "bg-orange-500",
      problems: [
        {
          id: 6,
          title: "Merge k Sorted Lists",
          difficulty: "Hard",
          status: "attempted",
          tags: ["Linked List", "Divide and Conquer", "Heap"],
          description:
            "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.",
          timeComplexity: "O(n log k)",
          spaceComplexity: "O(1)",
        },
        {
          id: 7,
          title: "Product of Array Except Self",
          difficulty: "Medium",
          status: "solved",
          tags: ["Array", "Prefix Sum"],
          description:
            "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
        },
      ],
    },
    meta: {
      name: "Meta",
      color: "bg-blue-600",
      problems: [
        {
          id: 8,
          title: "Valid Parentheses",
          difficulty: "Easy",
          status: "solved",
          tags: ["String", "Stack"],
          description:
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
        },
      ],
    },
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-success bg-success/20 border border-success/30";
      case "Medium":
        return "text-warning bg-warning/20 border border-warning/30";
      case "Hard":
        return "text-error bg-error/20 border border-error/30";
      default:
        return "text-base-content bg-base-200 border border-base-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "attempted":
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <Circle className="w-5 h-5 text-base-content/40" />;
    }
  };

  const filteredProblems =
    companySheets[selectedSheet]?.problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    }) || [];

  return (
    <div className="min-h-screen w-full bg-base-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-base-200 shadow-xl border-r border-base-300 overflow-y-auto">
          <div className="p-6 border-b border-base-300">
            <Link to="/dashboard" className="flex items-center space-x-3 mb-4">
              <div className="flex items-center cursor-pointer space-x-3 mb-4 hover:opacity-70 transition-opacity" >
                <ArrowLeft className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold text-primary">Dashboard</h1>
              </div>
            </Link>
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="w-8 h-8 text-secondary" />
              <h1 className="text-2xl font-bold text-base-content">
                Company Sheets
              </h1>
            </div>
            <p className="text-base-content/70 text-sm">
              Practice problems from top tech companies
            </p>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold text-base-content mb-4">
              Companies
            </h2>
            <div className="space-y-2">
              {Object.entries(companySheets).map(([key, sheet]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSheet(key)}
                  className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-xl transition-all duration-200 group hover:shadow-lg ${
                    selectedSheet === key
                      ? "bg-success/50 text-primary-content shadow-lg scale-[1.02]"
                      : "bg-base-100 hover:bg-base-300 text-base-content"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${sheet.color}`}
                    ></div>
                    <span className="font-medium">{sheet.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm px-2 py-1 rounded-full font-medium ${
                        selectedSheet === key
                          ? "bg-primary-content/20 text-primary-content"
                          : "bg-base-200 text-base-content/70"
                      }`}
                    >
                      {sheet.problems.length}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        selectedSheet === key
                          ? "rotate-90"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-base-300 mt-auto">
            <div className="bg-gradient-to-br from-secondary/10 to-accent/10 p-4 rounded-xl border border-secondary/20">
              <h3 className="font-semibold text-base-content mb-2">
                Want to contribute?
              </h3>
              <p className="text-sm text-base-content/70 mb-3">
                Help us add more company-specific problems
              </p>
              <button className="btn btn-secondary btn-sm w-full">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-base-100 relative">
          {/* Background decoration */}
          <div className="absolute top-4 right-6 w-1/3 h-1/3 bg-gradient-to-br from-secondary/20 to-accent/20 blur-3xl rounded-full -z-10"></div>

          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-base-content flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full ${companySheets[selectedSheet]?.color}`}
                    ></div>
                    <span>{companySheets[selectedSheet]?.name} Problems</span>
                  </h2>
                  <p className="text-base-content/70 mt-2">
                    Master the coding interview with{" "}
                    {companySheets[selectedSheet]?.name}-specific problems
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-secondary fill-current" />
                  <span className="text-sm text-secondary font-semibold">
                    Curated Collection
                  </span>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-4 mb-6">
                <div className="relative flex-1 text-green-500">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-amber-600 text-green-500 w-5 h-5 " />
                  <input
                    type="text"
                    placeholder="Search problems or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10 bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="select select-bordered pl-10 bg-base-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Problems Grid */}
          <div className="flex flex-col space-y-4 min-h-[400px]">
  {filteredProblems.length > 0 ? (
    filteredProblems.map((problem) => (
      <div
        key={problem.id}
        className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-100 hover:border-success/50 group hover:scale-[1.02] cursor-pointer"
      >
        <div className="card-body p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(problem.status)}
              </div>
              
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-base-content group-hover:text-success transition-colors leading-tight">
                    {problem.title}
                  </h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-outline badge-sm hover:badge-primary transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDifficultyColor(
                  problem.difficulty,
                )}`}
              >
                {problem.difficulty}
              </span>
              <button className="btn btn-ghost btn-sm btn-square hover:btn-success hover:text-primary-content transition-all duration-200">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center py-20 px-6 min-h-[400px]">
      <div className="text-center max-w-md">
        <FileText className="w-20 h-20 text-base-content/20 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-base-content mb-3">
          No problems found
        </h3>
        <p className="text-base-content/60 mb-8 text-lg leading-relaxed">
          {searchTerm || difficultyFilter !== "all"
            ? "Try adjusting your search criteria or filters to find more problems"
            : "This company's problem sheet is currently being prepared"}
        </p>
        {searchTerm || difficultyFilter !== "all" ? (
          <button
            onClick={() => {
              setSearchTerm("");
              setDifficultyFilter("all");
            }}
            className="btn btn-primary btn-lg gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All Filters
          </button>
        ) : null}
      </div>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetsPage;
