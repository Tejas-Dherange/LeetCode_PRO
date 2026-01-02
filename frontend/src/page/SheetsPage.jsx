import React, { use, useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import useSubscriptionStore from "../store/useSubscriptionStore";
import useAuthStore from "../store/useAuthStore";
import { useCompanySheetStore } from "../store/UseCompanySheetStore";

const SheetsPage = () => {
  const [selectedSheet, setSelectedSheet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const { getSubscriptionStatus, subscription } = useSubscriptionStore();
  const { authUser } = useAuthStore();

  const {
    premiumSheets,
    isPremiumSheetsLoading,
    getSheetProblems,
    sheetProblems,
    isSheetsLoading,
    getPremiumCompanySheets,
  } = useCompanySheetStore();
 

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
    sheetProblems?.problems?.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    }) || [];

  useEffect(() => {
    // Sync the subscription status with the store
    getSubscriptionStatus(authUser?.id);
  }, [getSubscriptionStatus]);

  useEffect(() => {
    // Fetch premium company sheets when the component mounts
    getPremiumCompanySheets();
  }, [getPremiumCompanySheets]);

  useEffect(() => {
    // Fetch sheet problems when a sheet is selected
    if (selectedSheet) {
      getSheetProblems(selectedSheet);
    }
  }, [selectedSheet, getSheetProblems]);

  return (
    <div className="min-h-screen w-full bg-base-100">
      {/* //if subscription is not active then shoe that access is denied */}
      {/* is subscription is undefined then add check */}

      {!subscription?.status == "ACTIVE" ||
        (!subscription && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-error mb-4">
                Access Denied
              </h1>
              <p className="text-lg text-base-content/70 mb-6">
                Your subscription is not active. Please subscribe to access the
                company sheets.
              </p>
              <Link to="/dashboard/pricing">
                <button className="btn btn-primary">Subscribe Now</button>
              </Link>
            </div>
          </div>
        ))}
      {subscription?.status == "ACTIVE" && (
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-base-200 shadow-xl border-r border-base-300 overflow-y-auto">
            <div className="p-6 border-b border-base-300">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 mb-4"
              >
                <div className="flex items-center cursor-pointer space-x-3 mb-4 hover:opacity-70 transition-opacity">
                  <ArrowLeft className="w-6 h-6 text-primary" />
                  <h1 className="text-lg font-semibold text-primary">
                    Dashboard
                  </h1>
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

              {isPremiumSheetsLoading
              ? <Loader2 className="h-6 w-6 animate-spin" />
              : (
                <div className="space-y-2">
                  {premiumSheets.map((sheet) => (
                    <button
                      key={sheet.id}
                      onClick={() => setSelectedSheet(sheet.id)}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-xl transition-all duration-200 group hover:shadow-lg ${
                      selectedSheet === sheet.id
                        ? "bg-emerald-500/20 border-2 border-emerald-500/50 shadow-lg scale-[1.02]"
                        : "bg-base-100 hover:bg-base-300 text-base-content border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center  space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full bg-[${
                          sheet.color != "" ? sheet.color : "bg-[#3c1cb0]"
                        }]`}
                      ></div>
                      <span className="font-medium">{sheet.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm px-2 py-1 rounded-full font-medium ${
                          selectedSheet === sheet.id
                            ? "bg-primary-content/20 text-primary-content"
                            : "bg-base-200 text-base-content/70"
                        }`}
                      >
                        {sheet.problems.length}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          selectedSheet === sheet.id
                            ? "rotate-90"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
              )}

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
                {
                  (isPremiumSheetsLoading  || isSheetsLoading) ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-base-content flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full bg-[${sheetProblems?.color}]`}
                          >
                          </div>
                          <span>{sheetProblems?.name} Problems</span>
                        </h2>
                        <p className="text-base-content/70 mt-2">
                          Master the coding interview with {sheetProblems?.name } 
                           - specific problems
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full">
                        <Star className="w-5 h-5 text-secondary fill-current" />
                        <span className="text-sm text-secondary font-semibold">
                          Curated Collection
                        </span>
                      </div>
                    </div>
                  )
                }

                {/* Search and Filter */}
                <div className="flex space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
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
              {
                isPremiumSheetsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="flex flex-col space-y-4 min-h-[400px]">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem) => (
                    <Link
                      key={problem.id}
                      to={`/problem/${problem.id}`}
                      className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-emerald-500/50 group hover:scale-[1.02] cursor-pointer"
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
                                <h3 className="text-lg font-semibold text-base-content group-hover:text-emerald-500 transition-colors leading-tight">
                                  {problem.title}
                                </h3>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                  {problem.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="badge badge-outline badge-sm hover:badge-primary transition-colors"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Side - Difficulty Badge */}
                          <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDifficultyColor(
                                problem.difficulty,
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                            <ExternalLink className="w-5 h-5 text-base-content/40 group-hover:text-emerald-500 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Clear All Filters
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetsPage;
