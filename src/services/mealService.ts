import api from "@/lib/axios";
import { Meal, Category } from "@/types";

export const mealService = {
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data.data;
  },

  getMeals: async (params?: any) => {
    const response = await api.get("/meals", { params });
    return response.data.data;
  },

  getMealById: async (id: string) => {
    const response = await api.get(`/meals/${id}`);
    return response.data.data;
  },

  getProviderMeals: async () => {
    const response = await api.get("/provider/meals");
    return response.data.data;
  },

  createMeal: async (data: any) => {
    return api.post("/provider/meals", data);
  },

  updateMeal: async (id: string, data: any) => {
    return api.put(`/provider/meals/${id}`, data);
  },

  deleteMeal: async (id: string) => {
    return api.delete(`/provider/meals/${id}`);
  },

  getMealReviews: async (mealId: string) => {
    const response = await api.get(`/reviews/meal/${mealId}`);
    return response.data.data;
  }
};
