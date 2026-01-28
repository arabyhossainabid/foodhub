import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://foodhub-backend-api.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    error.userMessage = message;

    if (error.response?.status === 401 && typeof window !== "undefined") {
      const publicPaths = ["/login", "/register", "/"];
      const isPublicPath = publicPaths.includes(window.location.pathname);

      if (!isPublicPath) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?message=Session expired. Please login again.";
      }
    }

    if (error.response?.status === 429) {
      console.warn("Rate limited. Please slow down.");
    }

    return Promise.reject(error);
  }
);

export default api;
