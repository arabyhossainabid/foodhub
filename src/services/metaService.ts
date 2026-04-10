import api from "@/lib/axios";

export const metaService = {
  getStats: async () => {
    const response = await api.get("/meta/stats");
    return response.data.data;
  },
  getOffers: async () => {
    const response = await api.get("/meta/offers");
    return response.data.data;
  }
};
