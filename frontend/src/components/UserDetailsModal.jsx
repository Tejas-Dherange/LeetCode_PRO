import React from "react";
import {
  X,
  Award,
  TrendingUp,
  Code2,
  Target,
  Calendar,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserDetailsModal = ({ user, userDetails, onClose }) => {
  if (!userDetails) return null;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "badge-success";
      case "MEDIUM":
        return "badge-warning";
      case "HARD":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getStatusColor = (status) => {
    return status === "ACCEPTED" ? "text-success" : "text-error";
  };

  // Prepare language data for pie chart
  const languageData = Object.entries(userDetails.languageStats || {}).map(
    ([name, value]) => ({ name, value })
  );

  // Prepare difficulty breakdown for bar chart
  const difficultyData = Object.entries(
    userDetails.stats.difficultyBreakdown
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full">
                <img
                  src={
                    userDetails.user.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt={userDetails.user.name}
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{userDetails.user.name}</h3>
              <p className="text-base-content/60">{userDetails.user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`badge ${
                    userDetails.user.role === "ADMIN"
                      ? "badge-error"
                      : "badge-ghost"
                  }`}
                >
                  {userDetails.user.role}
                </span>
                <span
                  className={`badge ${
                    userDetails.user.subscription === "PREMIUM"
                      ? "badge-warning"
                      : userDetails.user.subscription === "BASIC"
                      ? "badge-info"
                      : "badge-ghost"
                  }`}
                >
                  {userDetails.user.subscription}
                </span>
                <span className="text-sm text-base-content/60">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Joined {new Date(userDetails.user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-primary">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Problems Solved</div>
            <div className="stat-value text-primary">
              {userDetails.stats.problemsSolved}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-success">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Success Rate</div>
            <div className="stat-value text-success">
              {userDetails.stats.successRate}%
            </div>
            <div className="stat-desc">
              {userDetails.stats.acceptedSubmissions} /{" "}
              {userDetails.stats.totalSubmissions} accepted
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-warning">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="stat-title">Contests</div>
            <div className="stat-value text-warning">
              {userDetails.stats.contestsParticipated}
            </div>
          </div>
        </div>

        {/* Charts Row 1: Submission Timeline & Language Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Submission Timeline */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h4 className="card-title text-base">
                Submission Activity (Last 30 Days)
              </h4>
              {userDetails.submissionTimeline && (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userDetails.submissionTimeline}>
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
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Submissions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h4 className="card-title text-base">Language Preferences</h4>
              {languageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-base-content/60 py-8">
                  No submissions yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Difficulty Breakdown & Top Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Difficulty Breakdown */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h4 className="card-title text-base">Problems by Difficulty</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Tags */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h4 className="card-title text-base">
                <Code2 className="w-4 h-4" />
                Top Problem Tags
              </h4>
              {userDetails.topTags && userDetails.topTags.length > 0 ? (
                <div className="space-y-2">
                  {userDetails.topTags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="badge badge-outline">{tag.tag}</span>
                      <span className="text-sm font-semibold">
                        {tag.count} problems
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-base-content/60 py-8">
                  No tags yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pattern Progress */}
        {userDetails.patternProgress && userDetails.patternProgress.length > 0 && (
          <div className="card bg-base-100 border border-base-300 mb-6">
            <div className="card-body">
              <h4 className="card-title">
                <Target className="w-5 h-5" />
                Pattern Progress
              </h4>
              <div className="space-y-3">
                {userDetails.patternProgress.map((pattern, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{pattern.patternName}</span>
                      <span className="text-sm text-base-content/60">
                        {pattern.completedProblems} / {pattern.totalProblems}
                      </span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={pattern.progressPercentage}
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title">Recent Activity</h4>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.recentActivity &&
                  userDetails.recentActivity.length > 0 ? (
                    userDetails.recentActivity.map((activity, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">
                          {activity.problemTitle}
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm ${getDifficultyColor(
                              activity.difficulty
                            )}`}
                          >
                            {activity.difficulty}
                          </span>
                        </td>
                        <td className={getStatusColor(activity.status)}>
                          {activity.status}
                        </td>
                        <td>
                          <span className="badge badge-sm badge-outline">
                            {activity.language}
                          </span>
                        </td>
                        <td className="text-sm text-base-content/60">
                          {new Date(activity.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-base-content/60">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default UserDetailsModal;
