import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://foodhub-backend-seven.vercel.app/api",
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from response
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    // Attach formatted message to error
    error.userMessage = message;

    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Don't redirect if we are already on the login or register page to avoid loops
      const publicPaths = ["/login", "/register", "/"];
      const isPublicPath = publicPaths.includes(window.location.pathname);

      if (!isPublicPath) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?message=Session expired. Please login again.";
      }
    }

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      console.warn("Rate limited. Please slow down.");
    }

    return Promise.reject(error);
  }
);

export default api;
