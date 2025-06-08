import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

export const useExecutionStore = create((set) => ({
  isRunExecuting: false,
  isSubmitExecuting: false,
  submission: null,
  runResults: null,
  runCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isRunExecuting: true });
      const res = await axiosInstance.post("/execute-code/run-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      // console.log(res.data);
      set({ runResults: res.data.results, submission: null });
      toast.success(res.data.message || "code executed succesfully");
    } catch (error) {
      console.error("error in execution", error);
      toast.error("error in execution");
    } finally {
      set({ isRunExecuting: false });
    }
  },
  submitCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isSubmitExecuting: true });
      const res = await axiosInstance.post("/execute-code/submit-code", {
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
      console.error("error in execution", error);
      toast.error("error in execution");
    } finally {
      set({ isSubmitExecuting: false });
    }
  },
  clearRunResults: () => set({ runResults: null }),
}));
