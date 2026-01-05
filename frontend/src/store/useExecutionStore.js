import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

export const useExecutionStore = create((set, get) => ({
  isRunExecuting: false,
  isSubmitExecuting: false,
  submission: null,
  runResults: null,
  queueInfo: null, // Store queue position information
  cooldownEndTime: null, // Timestamp when cooldown ends
  cooldownSeconds: 0, // Remaining seconds in cooldown
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
      set({ runResults: res.data.results, submission: null, queueInfo: res.data.queueInfo || null });
      
      // Show queue info if available
      if (res.data.queueInfo && res.data.queueInfo.waiting > 0) {
        toast.success(
          `Code executed! (Queue position: ${res.data.queueInfo.position}, Wait: ${res.data.queueInfo.estimatedWait})`,
          { duration: 4000 }
        );
      } else {
        toast.success(res.data.message || "code executed succesfully");
      }
      
      // Start cooldown timer for run code too
      get().startCooldown(30);
    } catch (error) {
      console.error("error in execution", error);
      
      // Handle rate limiting errors (429)
      if (error.response?.status === 429) {
        const rateLimitData = error.response.data;
        const retryAfter = rateLimitData.retryAfter || 60;
        const limitType = rateLimitData.limit || "Rate limit";
        
        toast.error(
          `${limitType} exceeded! Wait ${retryAfter}s before trying again.`,
          { duration: 5000 }
        );
      } else if (error.response?.status === 503) {
        toast.error("Service temporarily unavailable. Please try again later.", {
          duration: 4000
        });
      } else {
        toast.error(error.response?.data?.message || "Error in execution");
      }
    } finally {
      set({ isRunExecuting: false });
    }
  },

  // Start cooldown timer
  startCooldown: (seconds) => {
    const endTime = Date.now() + (seconds * 1000);
    set({ cooldownEndTime: endTime, cooldownSeconds: seconds });

    // Update countdown every second
    const interval = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        set({ cooldownEndTime: null, cooldownSeconds: 0 });
        clearInterval(interval);
      } else {
        set({ cooldownSeconds: remaining });
      }
    }, 1000);
  },

  submitCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
    contestId = null, // Add contestId optional param
  ) => {
    try {
      set({ isSubmitExecuting: true });
      const res = await axiosInstance.post("/execute-code/submit-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
        contestId, // Send contestId to backend
      });

      // console.log(res.data);
      set({ submission: res.data.submission, runResults: null, queueInfo: res.data.queueInfo || null });
      
      // Show queue info if available
      if (res.data.queueInfo && res.data.queueInfo.waiting > 0) {
        const waitSeconds = res.data.queueInfo.waiting * 15; // Estimate
        toast.success(
          `Code submitted! Queue position: ${res.data.queueInfo.position}`,
          { duration: 4000 }
        );
        // Start cooldown timer
        get().startCooldown(waitSeconds);
      } else {
        toast.success(res.data.message || "code executed succesfully");
        // Default 30 second cooldown
        get().startCooldown(30);
      }
    } catch (error) {
      console.error("error in execution", error);
      
      // Handle rate limiting errors (429)
      if (error.response?.status === 429) {
        const rateLimitData = error.response.data;
        const retryAfter = rateLimitData.retryAfter || 60;
        const limitType = rateLimitData.limit || "Rate limit";
        
        toast.error(
          `${limitType} exceeded! Wait ${retryAfter}s before trying again.`,
          { duration: 5000 }
        );
      } else if (error.response?.status === 503) {
        toast.error("Service temporarily unavailable. Please try again later.", {
          duration: 4000
        });
      } else {
        toast.error(error.response?.data?.message || "Error in execution");
      }
    } finally {
      set({ isSubmitExecuting: false });
    }
  },

  clearRunResults: () => set({ runResults: null }),
}));
