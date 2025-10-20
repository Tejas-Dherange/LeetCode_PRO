import { create } from "zustand";
import { axiosInstance } from "../libs/axios";


const useActivityStore = create((set) => ({
activity: [],
  fetchActivity: async (userId) => {
    try {
      const res = await axiosInstance.get(`/contribution/activity/${userId}`);
      set({ activity: res.data.data }); 
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  }
}));

export default useActivityStore;