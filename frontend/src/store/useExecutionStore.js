import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../libs/axios";


export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isExecuting: true });
      const res = await axiosInstance.post("/execute-code/execute", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      
      console.log(res.data);
      set({ submission: res.data.submission });
      toast.success(res.data.message || "code executed succesfully");
    } catch (error) {
      console.error("error in execution",error);
      toast.error("error in execution");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
