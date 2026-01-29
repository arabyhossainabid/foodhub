import api from "@/lib/axios";

export const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    return api.patch(`/admin/users/${id}`, { isActive });
  },
  getAllOrders: async () => {
    const response = await api.get("/admin/orders");
    return response.data.data;
  },

  categories: {
    create: async (name: string) => {
      return api.post("/admin/categories", { name });
    },
    update: async (id: string, name: string) => {
      return api.put(`/admin/categories/${id}`, { name });
    },
    delete: async (id: string) => {
      return api.delete(`/admin/categories/${id}`);
    }
  },

  reviews: {
    getAll: async () => {
      const response = await api.get("/admin/reviews");
      return response.data.data;
    },
    delete: async (id: string) => {
      return api.delete(`/admin/reviews/${id}`);
    }
  }
};
