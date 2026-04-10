import api from "@/lib/axios";

export type ManagerStats = {
  managedRevenue7d: number;
  pendingOrders: number;
  activeProviders: number;
  deliveredOrders7d: number;
  newCustomers7d: number;
};

export const managerService = {
  getStats: async () => {
    const response = await api.get("/manager/stats");
    return response.data.data as ManagerStats;
  },
};

