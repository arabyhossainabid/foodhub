import api from '@/lib/axios';

export const providerService = {
  // Get all providers
  getAll: async () => {
    const response = await api.get('/providers');
    return response.data.data;
  },

  // Get single provider details
  getById: async (id: string) => {
    const response = await api.get(`/providers/${id}`);
    return response.data.data;
  },

  // Get provider dashboard stats
  getStats: async () => {
    const response = await api.get('/provider/stats');
    return response.data.data;
  },
};
