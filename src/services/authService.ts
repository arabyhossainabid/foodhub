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

  updateProfile: async (data: any) => {
    return api.patch("/auth/update-profile", data);
  },

  logout: async () => {
  }
};
