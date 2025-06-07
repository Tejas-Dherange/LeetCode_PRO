export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1" // For local dev
      : "https://api.codeloom.software/api/v1", // For production
  withCredentials: true,
});
