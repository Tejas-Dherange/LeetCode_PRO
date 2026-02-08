import React, { useEffect, useState } from "react";
import { useMonitoringStore } from "../store/useMonitoringStore";
import {
  Users,
  TrendingUp,
  Award,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Code2,
  Target,
  Activity,
  Download,
  Eye,
} from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";
import {
  exportUsersToCSV,
  exportTopUsersToCSV,
  exportActivityToCSV,
  exportProblemStatsToCSV,
} from "../utils/csvExport";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminAnalyticsPage = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activityPeriod, setActivityPeriod] = useState("7d");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const {
    userAnalytics,
    problemStats,
    topUsers,
    usersList,
    activityTimeline,
    isLoading,
    lastUpdated,
    fetchAllAnalytics,
    fetchUsersList,
    fetchActivityTimeline,
    fetchUserDetails,
  } = useMonitoringStore();

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAllAnalytics();
      }, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchAllAnalytics]);

  useEffect(() => {
    fetchActivityTimeline(activityPeriod);
  }, [activityPeriod, fetchActivityTimeline]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsersList(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUsersList(newPage, searchTerm);
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setIsModalLoading(true);
    const details = await fetchUserDetails(user.id);
    setUserDetails(details);
    setIsModalLoading(false);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
          <p className="text-base-content/70">
            User activity tracking and platform statistics
          </p>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-sm text-base-content/60">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}

          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">Auto-refresh</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </label>
          </div>

          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => fetchAllAnalytics()}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <Users className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {userAnalytics?.totalUsers || 0}
                </div>
                <p className="text-sm opacity-90">Total Users</p>
              </div>
            </div>
            <div className="text-xs opacity-75 mt-2">
              +{userAnalytics?.newUsersThisMonth || 0} this month
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {userAnalytics?.activeUsers || 0}
                </div>
                <p className="text-sm opacity-90">Active Users</p>
              </div>
            </div>
            <div className="text-xs opacity-75 mt-2">Last 7 days</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <Users className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {userAnalytics?.newUsersThisWeek || 0}
                </div>
                <p className="text-sm opacity-90">New This Week</p>
              </div>
            </div>
            <div className="text-xs opacity-75 mt-2">
              {userAnalytics?.newUsersToday || 0} today
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <Award className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {userAnalytics?.subscriptionBreakdown?.PREMIUM || 0}
                </div>
                <p className="text-sm opacity-90">Premium Users</p>
              </div>
            </div>
            <div className="text-xs opacity-75 mt-2">
              {userAnalytics?.subscriptionBreakdown?.BASIC || 0} basic
            </div>
          </div>
        </div>
      </div>

      {/* Problem Stats and Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Problem Solving Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-title flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Problem Solving Statistics
              </h3>
              <button
                className="btn btn-sm btn-ghost gap-1"
                onClick={() => problemStats && exportProblemStatsToCSV(problemStats)}
                disabled={!problemStats}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Total Problems</div>
                <div className="stat-value text-2xl text-primary">
                  {problemStats?.totalProblems || 0}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Solved</div>
                <div className="stat-value text-2xl text-success">
                  {problemStats?.totalSolved || 0}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Unique Solvers</div>
                <div className="stat-value text-2xl text-info">
                  {problemStats?.uniqueSolvers || 0}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-xs">Avg/User</div>
                <div className="stat-value text-2xl text-warning">
                  {problemStats?.avgProblemsPerUser || 0}
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown Bar Chart */}
            {problemStats?.byDifficulty && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-sm">
                  Difficulty Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={Object.entries(problemStats.byDifficulty).map(
                      ([key, val]) => ({
                        difficulty: key,
                        total: val.total,
                        solved: val.solved,
                      })
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="difficulty" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3B82F6" name="Total" />
                    <Bar dataKey="solved" fill="#10B981" name="Solved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity Timeline
              </h3>
              <select
                className="select select-sm select-bordered"
                value={activityPeriod}
                onChange={(e) => setActivityPeriod(e.target.value)}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            {activityTimeline?.timeline ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityTimeline.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#3B82F6"
                    name="New Users"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#10B981"
                    name="Submissions"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="problemsSolved"
                    stroke="#F59E0B"
                    name="Problems Solved"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Users Leaderboard and Subscription Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Users Leaderboard */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-title flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Top Performers
              </h3>
              <button
                className="btn btn-sm btn-ghost gap-1"
                onClick={() => topUsers && exportTopUsersToCSV(topUsers)}
                disabled={!topUsers}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="w-12">Rank</th>
                    <th>User</th>
                    <th className="text-center">Problems</th>
                    <th className="text-center">Success %</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers?.map((user, idx) => (
                    <tr key={user.id} className="hover">
                      <td className="font-bold text-center">
                        {idx === 0 ? (
                          <span className="text-warning text-xl">🥇</span>
                        ) : idx === 1 ? (
                          <span className="text-base-content/60 text-xl">
                            🥈
                          </span>
                        ) : idx === 2 ? (
                          <span className="text-orange-600 text-xl">🥉</span>
                        ) : (
                          idx + 1
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                              <img
                                src={
                                  user.image ||
                                  "https://avatar.iran.liara.run/public/boy"
                                }
                                alt={user.name}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {user.name}
                            </div>
                            <div className="text-xs opacity-60">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center font-bold text-primary">
                        {user.problemsSolved}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge badge-sm ${
                            user.successRate >= 80
                              ? "badge-success"
                              : user.successRate >= 50
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {user.successRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Subscription Breakdown Pie Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Subscription Distribution</h3>
            {userAnalytics?.subscriptionBreakdown && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      userAnalytics.subscriptionBreakdown
                    ).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.keys(userAnalytics.subscriptionBreakdown).map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </h3>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-ghost gap-1"
                onClick={() => usersList?.users && exportUsersToCSV(usersList.users)}
                disabled={!usersList?.users}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <input
                type="text"
                placeholder="Search users..."
                className="input input-sm input-bordered w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="btn btn-sm btn-primary gap-2"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th className="text-center">Problems</th>
                  <th className="text-center">Submissions</th>
                  <th>Subscription</th>
                  <th>Joined</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList?.users?.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img
                              src={
                                user.image ||
                                "https://avatar.iran.liara.run/public/boy"
                              }
                              alt={user.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs opacity-60">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "ADMIN" ? "badge-error" : "badge-ghost"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center font-bold text-primary">
                      {user.problemsSolved}
                    </td>
                    <td className="text-center">{user.submissions}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.subscription === "PREMIUM"
                            ? "badge-warning"
                            : user.subscription === "BASIC"
                            ? "badge-info"
                            : "badge-ghost"
                        }`}
                      >
                        {user.subscription}
                      </span>
                    </td>
                    <td className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-ghost gap-1"
                        onClick={() => handleUserClick(user)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersList?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-base-content/60">
                Showing {usersList.users.length} of {usersList.pagination.total}{" "}
                users
              </div>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="join-item btn btn-sm">
                  Page {currentPage} of {usersList.pagination.totalPages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  disabled={!usersList.pagination.hasMore}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          userDetails={userDetails}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
