import api from '@/lib/axios';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    return api.patch(`/admin/users/${id}`, { isActive });
  },
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data.data;
  },

  categories: {
    create: async (name: string) => {
      const response = await api.post('/categories', { name });
      return response.data;
    },
    update: async (id: string, name: string) => {
      const response = await api.put(`/categories/${id}`, { name });
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    },
  },

  reviews: {
    getAll: async () => {
      const response = await api.get('/admin/reviews');
      return response.data.data;
    },
    delete: async (id: string) => {
      return api.delete(`/admin/reviews/${id}`);
    },
  },
};
