import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

const useAiStore = create((set) => ({
  isLLMLoading: false,
  complexity: null,

  getComplexity: async (code) => {
    try {
      set({ isLLMLoading: true });
      const res = await axiosInstance.post("/ai/time-complexity", {code});
      console.log(res.data);
      
      set({ complexity: res.data.complexity });
    } catch (error) {
      console.error("error occured in fetching complexity", error);
      toast.error("error in creating  fetching complexity");
    } finally {
      set({ isLLMLoading: false });
    }
  },
}));


export default useAiStore
