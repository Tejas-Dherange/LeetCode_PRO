import React, { useEffect, useState } from "react";
import { useMonitoringStore } from "../store/useMonitoringStore";
import {
  Activity,
  Database,
  Server,
  CheckCircle2,
  AlertCircle,
  Users,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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

const AdminMonitoringPage = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const {
    queueMetrics,
    judge0Health,
    redisMetrics,
    submissionAnalytics,
    systemHealth,
    isLoading,
    lastUpdated,
    fetchAllMetrics,
    startAutoRefresh,
    stopAutoRefresh,
  } = useMonitoringStore();

  useEffect(() => {
    if (autoRefresh) {
      startAutoRefresh(refreshInterval);
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
      case "optimal":
        return "text-success";
      case "degraded":
      case "warning":
      case "normal":
        return "text-warning";
      case "down":
      case "slow":
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "badge badge-sm";
    switch (status) {
      case "healthy":
      case "optimal":
        return `${baseClass} badge-success`;
      case "degraded":
      case "warning":
      case "normal":
        return `${baseClass} badge-warning`;
      case "down":
      case "slow":
        return `${baseClass} badge-error`;
      default:
        return `${baseClass} badge-ghost`;
    }
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="min-h-screen md:w-[98vw] bg-base-200 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Monitoring Dashboard</h1>
          <p className="text-base-content/70">
            Real-time system metrics and analytics
          </p>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-sm text-base-content/60">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
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
            onClick={() => fetchAllMetrics()}
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Queue Status */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <Activity className="w-8 h-8 text-primary" />
              <div className={getStatusBadge(queueMetrics?.status)}>
                {queueMetrics?.status || "Loading"}
              </div>
            </div>
            <h3 className="card-title text-lg mt-2">Queue</h3>
            <div className="text-3xl font-bold">{queueMetrics?.waiting || 0}</div>
            <p className="text-sm text-base-content/70">Waiting</p>
            <div className="text-sm">
              Active: {queueMetrics?.active || 0} | Completed: {queueMetrics?.completed || 0}
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="card-title text-lg mt-2">Success Rate</h3>
            <div className="text-3xl font-bold">
              {submissionAnalytics?.successRate || 0}%
            </div>
            <p className="text-sm text-base-content/70">Last 24 hours</p>
            <div className="text-sm">
              {submissionAnalytics?.successful || 0} / {submissionAnalytics?.total || 0} submissions
            </div>
          </div>
        </div>

        {/* Redis Status */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <Database className="w-8 h-8 text-info" />
              <div className={getStatusBadge(redisMetrics?.status)}>
                {redisMetrics?.status || "Loading"}
              </div>
            </div>
            <h3 className="card-title text-lg mt-2">Redis</h3>
            <div className="text-3xl font-bold">{redisMetrics?.memoryUsed || "N/A"}</div>
            <p className="text-sm text-base-content/70">Memory Used</p>
            <div className="text-sm">
              {redisMetrics?.opsPerSec || 0} ops/sec
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <Server className="w-8 h-8 text-warning" />
              <div className={getStatusBadge(systemHealth?.status)}>
                {systemHealth?.status || "Loading"}
              </div>
            </div>
            <h3 className="card-title text-lg mt-2">System</h3>
            <div className="text-3xl font-bold">
              {systemHealth?.uptime ? Math.floor(systemHealth.uptime / 3600) : 0}h
            </div>
            <p className="text-sm text-base-content/70">Uptime</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Submission Timeline */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Submission Activity (24h)</h3>
            {submissionAnalytics?.timeline ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={submissionAnalytics.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Language Distribution</h3>
            {submissionAnalytics?.byLanguage ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(submissionAnalytics.byLanguage).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.keys(submissionAnalytics.byLanguage).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">Service Health</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Response Time</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {systemHealth?.services && (
                  <>
                    <tr>
                      <td className="font-semibold">Database</td>
                      <td>
                        <div className={getStatusBadge(systemHealth.services.database.status)}>
                          {systemHealth.services.database.status}
                        </div>
                      </td>
                      <td>
                        {systemHealth.services.database.responseTime
                          ? `${systemHealth.services.database.responseTime}ms`
                          : "N/A"}
                      </td>
                      <td>PostgreSQL (Neon)</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Redis</td>
                      <td>
                        <div className={getStatusBadge(systemHealth.services.redis.status)}>
                          {systemHealth.services.redis.status}
                        </div>
                      </td>
                      <td>
                        {systemHealth.services.redis.responseTime
                          ? `${systemHealth.services.redis.responseTime}ms`
                          : "N/A"}
                      </td>
                      <td>Cache & Queue</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Judge0</td>
                      <td>
                        <div className={getStatusBadge(systemHealth.services.judge0.status)}>
                          {systemHealth.services.judge0.status}
                        </div>
                      </td>
                      <td>
                        {systemHealth.services.judge0.responseTime
                          ? `${systemHealth.services.judge0.responseTime}ms`
                          : "N/A"}
                      </td>
                      <td>{judge0Health?.endpoint || "Not configured"}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitoringPage;
