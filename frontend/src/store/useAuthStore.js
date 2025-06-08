import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/user/me");

      // console.log("BAckend data", res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.error("error occured while checking health", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/register", data);

      // Do NOT set authUser here to avoid auto-login after signup
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured while registering user", error);
      toast.error("error in signup");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);

      console.log("login user data", res.data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured while login in user", error);
      toast.error("error in login");
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.get("/user/logout");

      console.log("login user data", res.data);
      set({ authUser: null });
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured while login in user", error);
      toast.error("error in login");
    }
  },
}));

export default useAuthStore;
