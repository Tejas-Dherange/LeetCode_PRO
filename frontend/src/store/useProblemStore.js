import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set, get) => ({
  isProblemLoading: false,
  isProblemsLoading: false,
  isLoadingMore: false,
  problems: [],
  problem: null,
  solvedProblems: [],
  multipleIdProblems: [],
  
  // Pagination state
  pagination: {
    page: 1,
    limit: 20,
    hasMore: false,
    total: 0,
    totalPages: 0,
  },
  
  // Filter state
  filters: {
    search: "",
    difficulty: "",
    tag: "",
  },

  getAllProblems: async (resetFilters = false) => {
    try {
      set({ isProblemsLoading: true });
      
      const { filters, pagination } = get();
      
      // If resetting filters, start from page 1
      const page = resetFilters ? 1 : pagination.page;
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (filters.search) params.append("search", filters.search);
      if (filters.difficulty) params.append("difficulty", filters.difficulty);
      if (filters.tag) params.append("tag", filters.tag);
      
      const res = await axiosInstance.get(`/problems/getAllProblems?${params}`);
      
      // Reset problems array when fetching fresh data
      set({ 
        problems: res.data.allProblems,
        pagination: {
          ...res.data.pagination,
          page: res.data.pagination.currentPage,
        },
      });
    } catch (error) {
      console.error("error occurred in fetching all problems", error);
      toast.error("error in fetching problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  loadMoreProblems: async () => {
    const { pagination, isLoadingMore, filters } = get();
    
    // Don't load if already loading or no more data
    if (isLoadingMore || !pagination.hasMore) return;
    
    try {
      set({ isLoadingMore: true });
      
      const nextPage = pagination.page + 1;
      
      // Build query parameters
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (filters.search) params.append("search", filters.search);
      if (filters.difficulty) params.append("difficulty", filters.difficulty);
      if (filters.tag) params.append("tag", filters.tag);
      
      const res = await axiosInstance.get(`/problems/getAllProblems?${params}`);
      
      // Append new problems to existing array
      set((state) => ({
        problems: [...state.problems, ...res.data.allProblems],
        pagination: {
          ...res.data.pagination,
          page: res.data.pagination.currentPage,
        },
      }));
    } catch (error) {
      console.error("error occurred in loading more problems", error);
      toast.error("error in loading more problems");
    } finally {
      set({ isLoadingMore: false });
    }
  },

  updateFilters: async (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1
    }));
    
    // Fetch problems with new filters
    await get().getAllProblems(true);
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get(`/problems/get-problem-byId/${id}`);
      set({ problem: res.data.problem });
      toast.success(res.data.message || "problem fetched successfully");
    } catch (error) {
      console.error("error occurred in fetching  problem", error);
      toast.error("error in fetching problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getProblemSolvedByUser: async () => {
    try {
      const res = await axiosInstance.get(
        "/problems/getAllProblemsSolvedByUser",
      );
      console.log(res);
      set({ solvedProblems: res.data.problemSolvedByUser });
    } catch (error) {
      console.error("error occurred in fetching  problem", error);
      toast.error("error in fetching problem");
    }
  },

  deleteProblem: async (id) => {
    try {
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      console.log(res);
      toast.success(res.data.message || "problem deleted successfully");
    } catch (error) {
      console.error("error occurred in deleting  problem", error);
      toast.error("error in deleting problem");
    }
  },

  getProblemByMultipleIds: async (ids) => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstance.post("/problems/getProblemByMultipleIds", {
        ids,
      });
      set({ multipleIdProblems: res.data.problems });
    } catch (error) {
      console.error("error occurred in fetching problems by multiple ids", error);
      toast.error("error in fetching problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },
}));
