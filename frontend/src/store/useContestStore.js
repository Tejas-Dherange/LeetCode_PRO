import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useContestStore = create((set) => ({
  isContestLoading: false,
  isContestsLoading: false,
  contests: [],
  contest: null,

  getAllContests: async () => {
    try {
      set({ isContestsLoading: true });
      const res = await axiosInstance.get("/contest/get-all-contests");
      set({ contests: res.data.contests });
    } catch (error) {
      console.error("Error occurred in fetching all contests", error);
      toast.error("Error in fetching contests");
    } finally {
      set({ isContestsLoading: false });
    }
  },

  getContestById: async (id) => {
    try {
      set({ isContestLoading: true });
      console.log("Fetching contest with ID:", id);

      const res = await axiosInstance.get(`/contest/get-contest/${id}`);
      console.log("Contest fetched successfully:", res.data);
      set({ contest: res.data.contest });
      toast.success(res.data.message || "Contest fetched successfully");
    } catch (error) {
      console.error("Error occurred in fetching contest", error);
      toast.error("Error in fetching contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  createContest: async (contestData) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.post(
        "/contest/create-contest",
        contestData,
      );
      toast.success(res.data.message || "Contest created successfully");
      set((state) => ({
        contests: [...state.contests, res.data.contest],
      }));
    } catch (error) {
      console.error("Error occurred in creating contest", error);
      toast.error("Error in creating contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  deleteContest: async (id) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.delete(`/contest/delete-contest/${id}`);
      toast.success(res.data.message || "Contest deleted successfully");
      set((state) => ({
        contests: state.contests.filter((contest) => contest._id !== id),
      }));
    } catch (error) {
      console.error("Error occurred in deleting contest", error);
      toast.error("Error in deleting contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  registerForContest: async (contestId) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.post(`/contest/register`, { contestId });
      toast.success(res.data.message || "Registered for contest successfully");
    } catch (error) {
      console.error("Error occurred in registering for contest", error);
      toast.error("Error in registering for contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  contestLeaderBoard: async (contestId) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.post(
        `/contest/contest/${contestId}/leaderboard`,
      );
      toast.success(res.data.message || "Leaderboard fetched successfully");
      return res.data.leaderboard; // Assuming the response contains a leaderboard
    } catch (error) {
      console.error("Error occurred in fetching contest leaderboard", error);
      toast.error("Error in fetching contest leaderboard");
    } finally {
      set({ isContestLoading: false });
    }
  },

  addProblemToContest: async (contestId, problemData) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.post(
        `/contest/add-problem-to-contest/${contestId}`,
        problemData,
      );
      toast.success(
        res.data.message || "Problem added to contest successfully",
      );
      // Optionally update the contest state with the new problem
    } catch (error) {
      console.error("Error occurred in adding problem to contest", error);
      toast.error("Error in adding problem to contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  contestProblemSubmission: async (contestId, problemId, submissionData) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.post(
        `/contest/contest-submission/${contestId}/${problemId}`,
        submissionData,
      );
      toast.success(res.data.message || "Submission made successfully");
      // Optionally handle the response or update state
    } catch (error) {
      console.error("Error occurred in contest problem submission", error);
      toast.error("Error in contest problem submission");
    } finally {
      set({ isContestLoading: false });
    }
  },

  getAllProblemsInContest: async (contestId) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.get(
        `/contest/get-all-problems-in-contest/${contestId}`,
      );
      toast.success(res.data.message || "Problems fetched successfully");
      return res.data.problems; // Assuming the response contains a list of problems
    } catch (error) {
      console.error(
        "Error occurred in fetching all problems in contest",
        error,
      );
      toast.error("Error in fetching problems in contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  getContestProblemsSolvedByUser: async () => {
    try {
      const res = await axiosInstance.get(
        "/contest/getAllProblemsSolvedByUser",
      );
      console.log(res);
      set({ solvedProblems: res.data.problemSolvedByUser });
      // toast.success(res.data.message);
    } catch (error) {
      console.error(
        "Error occurred in fetching problems solved by user",
        error,
      );
      toast.error("Error in fetching problems solved by user");
    }
  },

  updateContest: async (id, updatedData) => {
    try {
      const res = await axiosInstance.put(
        `/contest/update-contest/${id}`,
        updatedData,
      );
      console.log(res);
      set((state) => ({
        contests: state.contests.map((contest) =>
          contest._id === id
            ? { ...contest, ...res.data.updatedContest }
            : contest,
        ),
      }));
      toast.success(res.data.message || "Contest updated successfully");
    } catch (error) {
      console.error("Error occurred in updating contest", error);
      toast.error("Error in updating contest");
    }
  },

  updateContestProblem: async (contestId, problemId, updatedData) => {
    try {
      const res = await axiosInstance.put(
        `/contest/update-problem/${contestId}/${problemId}`,
        updatedData,
      );
      console.log(res);
      // Optionally update the contest state with the updated problem
      toast.success(res.data.message || "Problem updated successfully");
    } catch (error) {
      console.error("Error occurred in updating contest problem", error);
      toast.error("Error in updating contest problem");
    }
  },

  deleteContestProblem: async (contestId, problemId) => {
    try {
      const res = await axiosInstance.delete(
        `/contest/delete-problem/${contestId}/${problemId}`,
      );
      console.log(res);
      // Optionally update the contest state to remove the deleted problem
      toast.success(res.data.message || "Problem deleted successfully");
    } catch (error) {
      console.error("Error occurred in deleting contest problem", error);
      toast.error("Error in deleting contest problem");
    }
  },

  isRegisteredForContest: async (contestId) => {
    try {
      const res = await axiosInstance.get(
        `/contest/is-registered/${contestId}`,
      );
      return res.data.registered; // Assuming the response contains a boolean
    } catch (error) {
      console.error("Error occurred in checking contest registration", error);
      toast.error("Error in checking contest registration");
      return false; // Default to not registered on error
    }
  },

  unRegisterContest: async (contestId) => {
    try {
      const res = await axiosInstance.delete(
        `/contest/unregister/${contestId}`,
      );
      toast.success(
        res.data.message || "Unregistered from contest successfully",
      );
      return res.data; // Assuming the response contains relevant data
    } catch (error) {
      console.error("Error occurred in unregistering from contest", error);
      toast.error("Error in unregistering from contest");
    }
  },
}));
