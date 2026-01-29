import api from "@/lib/axios";

export const authService = {
  register: async (data: any) => {
    return api.post("/auth/register", data);
  },

  login: async (credentials: any) => {
    return api.post("/auth/login", credentials);
  },

  getProfile: async () => {
    return api.get("/auth/me");
  },

  logout: async () => {
  }
};
