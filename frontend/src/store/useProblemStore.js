import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
  isProblemLoading: false,
  isProblemsLoading: false,
  problems: [],
  problem: null,
  solvedProblems: [],

  getAllProblems: async () => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get("/problems/getAllProblems");
    //   console.log(res);
      set({ problems: res.data.allProblems });
    } catch (error) {
      console.error("error occured in fetching all problems", error);
      toast.error("error in fetching problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },
  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get(`/problems/get-problem-byId/${id}`);
      // console.log(res);
      set({ problem: res.data.problem });
      toast.success(res.data.message || "problem fetched successfully");
    } catch (error) {
      console.error("error occured in fetching  problem", error);
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
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured in fetching  problem", error);
      toast.error("error in fetching problem");
    }
  },
//   updateProblem: async (id) => {
//     try {
//       const res = await axiosInstance.get(`/problems/update-problem/${id}`);
//       console.log(res);
//       set({ solvedProblems: res.data.problemSolvedByUser });
//       toast.success(res.data.message);
//     } catch (error) {
//       console.error("error occured in fetching  problem", error);
//       toast.error("error in fetching problem");
//     }
//   },

     deleteProblem:async(id)=>{
      try {
        const res=await axiosInstance.delete(`/problems/delete-problem/${id}`)

        console.log(res);

        toast.success(res.data.message || "problem deleted succesfully")
        
      } catch (error) {
        console.error("error occured in deleting  problem", error);
      toast.error("error in deleting problem");
      }
     }

}));



