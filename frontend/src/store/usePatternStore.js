import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const usePatternStore = create((set, get) => ({
  patterns: [],
  currentPattern: null,
  patternProgress: [],
  isLoading: false,
  isPatternLoading: false,

  // Get all patterns
  getAllPatterns: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/patterns");
      set({ patterns: res.data.patterns });
    } catch (error) {
      console.error("Error fetching patterns:", error);
      toast.error("Error fetching patterns");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get pattern by ID
  getPatternById: async (id) => {
    try {
      set({ isPatternLoading: true });
      const res = await axiosInstance.get(`/patterns/${id}`);
      set({ currentPattern: res.data.pattern });
      return res.data.pattern;
    } catch (error) {
      console.error("Error fetching pattern:", error);
      toast.error("Error fetching pattern");
      return null;
    } finally {
      set({ isPatternLoading: false });
    }
  },

  // Get pattern by slug
  getPatternBySlug: async (slug) => {
    try {
      set({ isPatternLoading: true });
      const res = await axiosInstance.get(`/patterns/slug/${slug}`);
      set({ currentPattern: res.data.pattern });
      return res.data.pattern;
    } catch (error) {
      console.error("Error fetching pattern:", error);
      toast.error("Error fetching pattern");
      return null;
    } finally {
      set({ isPatternLoading: false });
    }
  },

  // Get user progress for all patterns
  getUserProgress: async () => {
    try {
      const res = await axiosInstance.get("/patterns/progress/user");
      set({ patternProgress: res.data.progress });
    } catch (error) {
      console.error("Error fetching pattern progress:", error);
      toast.error("Error fetching pattern progress");
    }
  },

  // Create pattern (Admin)
  createPattern: async (patternData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/patterns", patternData);
      toast.success(res.data.message || "Pattern created successfully");
      
      // Refresh patterns list
      await get().getAllPatterns();
      
      return res.data.pattern;
    } catch (error) {
      console.error("Error creating pattern:", error);
      toast.error(error.response?.data?.message || "Error creating pattern");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update pattern (Admin)
  updatePattern: async (id, patternData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put(`/patterns/${id}`, patternData);
      toast.success(res.data.message || "Pattern updated successfully");
      
      // Refresh patterns list
      await get().getAllPatterns();
      
      return res.data.pattern;
    } catch (error) {
      console.error("Error updating pattern:", error);
      toast.error(error.response?.data?.message || "Error updating pattern");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete pattern (Admin)
  deletePattern: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(`/patterns/${id}`);
      toast.success(res.data.message || "Pattern deleted successfully");
      
      // Refresh patterns list
      await get().getAllPatterns();
      
      return true;
    } catch (error) {
      console.error("Error deleting pattern:", error);
      toast.error(error.response?.data?.message || "Error deleting pattern");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Add problem to pattern (Admin)
  addProblemToPattern: async (patternId, problemData) => {
    try {
      const res = await axiosInstance.post(
        `/patterns/${patternId}/problems`,
        problemData
      );
      toast.success(res.data.message || "Problem added to pattern successfully");
      
      // Refresh current pattern
      if (get().currentPattern?.id === patternId) {
        await get().getPatternById(patternId);
      }
      
      return res.data.problemInPattern;
    } catch (error) {
      console.error("Error adding problem to pattern:", error);
      toast.error(error.response?.data?.message || "Error adding problem to pattern");
      return null;
    }
  },

  // Remove problem from pattern (Admin)
  removeProblemFromPattern: async (patternId, problemId) => {
    try {
      const res = await axiosInstance.delete(
        `/patterns/${patternId}/problems/${problemId}`
      );
      toast.success(res.data.message || "Problem removed from pattern successfully");
      
      // Refresh current pattern
      if (get().currentPattern?.id === patternId) {
        await get().getPatternById(patternId);
      }
      
      return true;
    } catch (error) {
      console.error("Error removing problem from pattern:", error);
      toast.error(error.response?.data?.message || "Error removing problem from pattern");
      return false;
    }
  },

  // Update problem order in pattern (Admin)
  updateProblemOrder: async (patternId, problemOrders) => {
    try {
      const res = await axiosInstance.put(
        `/patterns/${patternId}/problems/order`,
        { problemOrders }
      );
      toast.success(res.data.message || "Problem order updated successfully");
      
      // Refresh current pattern
      if (get().currentPattern?.id === patternId) {
        await get().getPatternById(patternId);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating problem order:", error);
      toast.error(error.response?.data?.message || "Error updating problem order");
      return false;
    }
  },

  // Clear current pattern
  clearCurrentPattern: () => {
    set({ currentPattern: null });
  },

  // Recalculate user progress for all patterns
  recalculateProgress: async () => {
    try {
      const res = await axiosInstance.post("/patterns/progress/recalculate");
      toast.success(res.data.message || "Progress recalculated successfully");
      return true;
    } catch (error) {
      console.error("Error recalculating progress:", error);
      toast.error(error.response?.data?.message || "Error recalculating progress");
      return false;
    }
  },
}));
