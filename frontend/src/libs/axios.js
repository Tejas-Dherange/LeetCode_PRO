import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1"
      : (import.meta.env.VITE_API_BASE_URL || "https://api.codeloomhq.me/api/v1"),
      withCredentials: true,
});
