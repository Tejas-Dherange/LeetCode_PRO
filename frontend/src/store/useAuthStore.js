import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isCheckingAuth: false,
  isEditingProfile: false,

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
      toast.error(error.response?.data?.message || "error in signup");
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
      toast.error(error.response?.data?.message || "error in login");
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

  editProfile: async (formData) => {
    set({ isEditingProfile: true });
    try {
      // Debug: log FormData keys and values
      for (let pair of formData.entries()) {
        console.log("formdata pair", pair[0], pair[1]);
      }

      // Send FormData directly, do NOT convert to object
      const res = await axiosInstance.put("/user/edit-profile", formData);

      console.log("edit profile data", res.data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.error("error occured while editing profile", error);
      toast.error(error.response?.data?.message || "error in editing profile");
    } finally {
      set({ isEditingProfile: false });
    }
  },

  googleSignIn: () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL ||  "https://api.codeloom.software/api/v1";
    window.location.href = `${apiUrl}/user/google`;
  }
}));

export default useAuthStore;
