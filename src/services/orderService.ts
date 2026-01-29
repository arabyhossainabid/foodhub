import api from "@/lib/axios";

export const orderService = {
  createOrder: async (orderData: any) => {
    return api.post("/orders", orderData);
  },

  getMyOrders: async () => {
    const response = await api.get("/orders");
    return response.data.data;
  },

  getOrderDetails: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  getProviderOrders: async () => {
    const response = await api.get("/provider/orders");
    return response.data.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    return api.patch(`/provider/orders/${id}`, { status });
  }
};
