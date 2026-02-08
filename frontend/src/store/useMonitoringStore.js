import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useMonitoringStore = create((set, get) => ({
  // State
  queueMetrics: null,
  judge0Health: null,
  redisMetrics: null,
  submissionAnalytics: null,
  systemHealth: null,
  userAnalytics: null,
  problemStats: null,
  topUsers: null,
  usersList: null,
  activityTimeline: null,
  isLoading: false,
  lastUpdated: null,
  autoRefreshInterval: null,

  // Actions
  fetchQueueMetrics: async () => {
    try {
      const res = await axiosInstance.get("/admin/monitoring/queue");
      set({ queueMetrics: res.data.data, lastUpdated: new Date() });
    } catch (error) {
      console.error("Error fetching queue metrics:", error);
      if (error.response?.status !== 403) {
        toast.error("Failed to fetch queue metrics");
      }
    }
  },

  fetchJudge0Health: async () => {
    try {
      const res = await axiosInstance.get("/admin/monitoring/judge0");
      set({ judge0Health: res.data.data });
    } catch (error) {
      console.error("Error fetching Judge0 health:", error);
    }
  },

  fetchRedisMetrics: async () => {
    try {
      const res = await axiosInstance.get("/admin/monitoring/redis");
      set({ redisMetrics: res.data.data });
    } catch (error) {
      console.error("Error fetching Redis metrics:", error);
    }
  },

  fetchSubmissionAnalytics: async (period = "24h") => {
    try {
      const res = await axiosInstance.get(`/admin/monitoring/submissions?period=${period}`);
      set({ submissionAnalytics: res.data.data });
    } catch (error) {
      console.error("Error fetching submission analytics:", error);
    }
  },

  fetchSystemHealth: async () => {
    try {
      const res = await axiosInstance.get("/admin/monitoring/system");
      set({ systemHealth: res.data.data });
    } catch (error) {
      console.error("Error fetching system health:", error);
    }
  },

  // New Analytics Methods
  fetchUserAnalytics: async () => {
    try {
      const res = await axiosInstance.get("/admin/monitoring/users/analytics");
      set({ userAnalytics: res.data.data });
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      toast.error("Failed to fetch user analytics");
    }
  },

  fetchProblemStats: async () => {
    try {
      const res = await axiosInstance.get("/admin/monitoring/problems/stats");
      set({ problemStats: res.data.data });
    } catch (error) {
      console.error("Error fetching problem stats:", error);
      toast.error("Failed to fetch problem statistics");
    }
  },

  fetchTopUsers: async (limit = 10) => {
    try {
      const res = await axiosInstance.get(`/admin/monitoring/users/top?limit=${limit}`);
      set({ topUsers: res.data.data });
    } catch (error) {
      console.error("Error fetching top users:", error);
      toast.error("Failed to fetch top users");
    }
  },

  fetchUsersList: async (page = 1, search = "") => {
    try {
      const res = await axiosInstance.get(`/admin/monitoring/users?page=${page}&limit=20&search=${search}`);
      set({ usersList: res.data.data });
    } catch (error) {
      console.error("Error fetching users list:", error);
      toast.error("Failed to fetch users list");
    }
  },

  fetchActivityTimeline: async (period = "7d") => {
    try {
      const res = await axiosInstance.get(`/admin/monitoring/activity?period=${period}`);
      set({ activityTimeline: res.data.data });
    } catch (error) {
      console.error("Error fetching activity timeline:", error);
      toast.error("Failed to fetch activity timeline");
    }
  },

  fetchUserDetails: async (userId) => {
    try {
      const res = await axiosInstance.get(`/admin/monitoring/users/${userId}/details`);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
      return null;
    }
  },

  fetchAllMetrics: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().fetchQueueMetrics(),
        get().fetchJudge0Health(),
        get().fetchRedisMetrics(),
        get().fetchSubmissionAnalytics(),
        get().fetchSystemHealth(),
      ]);
    } finally {
      set({ isLoading: false, lastUpdated: new Date() });
    }
  },

  fetchAllAnalytics: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().fetchUserAnalytics(),
        get().fetchProblemStats(),
        get().fetchTopUsers(),
        get().fetchUsersList(),
        get().fetchActivityTimeline(),
      ]);
    } finally {
      set({ isLoading: false, lastUpdated: new Date() });
    }
  },

  startAutoRefresh: (intervalMs = 5000) => {
    // Clear existing interval
    const currentInterval = get().autoRefreshInterval;
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    // Fetch immediately
    get().fetchAllMetrics();

    // Set new interval
    const newInterval = setInterval(() => {
      get().fetchAllMetrics();
    }, intervalMs);

    set({ autoRefreshInterval: newInterval });
  },

  stopAutoRefresh: () => {
    const currentInterval = get().autoRefreshInterval;
    if (currentInterval) {
      clearInterval(currentInterval);
      set({ autoRefreshInterval: null });
    }
  },
}));
