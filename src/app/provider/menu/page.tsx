"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Utensils, ShoppingCart, Plus, Edit, Trash2, SwitchCamera, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { NewMealForm } from "@/components/provider/NewMealForm";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
];

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mealsRes, catRes] = await Promise.all([
        api.get("/provider/meals"),
        api.get("/categories")
      ]);
      setMeals(mealsRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      toast.error("Failed to load your menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingMeal) {
        await api.put(`/provider/meals/${editingMeal.id}`, data);
        toast.success("Meal updated successfully");
      } else {
        await api.post("/provider/meals", data);
        toast.success("New meal added to your menu");
      }
      setIsFormOpen(false);
      setEditingMeal(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try {
      await api.delete(`/provider/meals/${id}`);
      toast.success("Meal deleted");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete meal");
    }
  };

  return (
    <DashboardLayout items={providerNavItems}>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extra-bold text-gray-900 tracking-tight">Manage Menu</h1>
            <p className="text-gray-500 font-medium">Create and update your meal offerings.</p>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)} className="rounded-2xl">
              <Plus size={20} className="mr-2" /> Add New Meal
            </Button>
          )}
        </div>

        {isFormOpen ? (
          <Card className="border-none shadow-2xl shadow-gray-200/50 p-8 rounded-3xl" data-aos="fade-up">
            <h2 className="text-2xl font-bold mb-8">{editingMeal ? "Edit Meal" : "Add New Meal"}</h2>
            <NewMealForm
              initialData={editingMeal || undefined}
              categories={categories}
              onSubmit={handleCreateOrUpdate}
              isLoading={isSubmitting}
              onCancel={() => { setIsFormOpen(false); setEditingMeal(null); }}
            />
          </Card>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl"></div>)}
              </div>
            ) : meals.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-aos="fade-up">
                {meals.map((meal) => (
                  <Card key={meal.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden">
                    <CardContent className="p-4 flex items-center space-x-6">
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                        {meal.image ? (
                          <img src={meal.image} className="h-full w-full object-cover" alt={meal.title} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <ImageOff size={32} />
                          </div>
                        )}
                      </div>

                      <div className="grow space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-gray-900">{meal.title}</h3>
                          {!meal.isAvailable && <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 font-black rounded-full uppercase">Unavailable</span>}
                        </div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{meal.category?.name || "Uncategorized"}</p>
                        <p className="text-[#FF5200] font-black">{formatCurrency(meal.price)}</p>
                      </div>

                      <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-gray-400 hover:text-[#FF5200] hover:bg-orange-50"
                          onClick={() => { setEditingMeal(meal); setIsFormOpen(true); }}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(meal.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Utensils size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your menu is empty</h3>
                <p className="text-gray-500">Start by adding your first delicious meal.</p>
                <Button onClick={() => setIsFormOpen(true)}>Add New Meal</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
