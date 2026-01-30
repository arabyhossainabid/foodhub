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
    const response = await api.patch(`/admin/users/${id}`, { isActive });
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data.data;
  },

  categories: {
    create: async (name: string) => {
      const response = await api.post('/admin/categories', { name });
      return response.data;
    },
    update: async (id: string, name: string) => {
      const response = await api.put(`/admin/categories/${id}`, { name });
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    },
  },

  reviews: {
    getAll: async () => {
      const response = await api.get('/admin/reviews');
      return response.data.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/admin/reviews/${id}`);
      return response.data;
    },
  },
};
