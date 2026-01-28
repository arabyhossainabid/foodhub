"use client";

import { LayoutDashboard, Utensils, ShoppingCart, Plus, Edit, Trash2, ImageOff, ChefHat, Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { NewMealForm } from "@/components/provider/NewMealForm";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
  { title: "Customer Reviews", href: "/provider/reviews", icon: <Star size={20} /> },
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
        toast.success("Masterpiece updated successfully");
      } else {
        await api.post("/provider/meals", data);
        toast.success("New dish added to your menu");
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
    if (!window.confirm("Are you sure you want to remove this dish?")) return;
    try {
      await api.delete(`/provider/meals/${id}`);
      toast.success("Meal removed from menu");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete meal");
    }
  };

  return (
    <ManagementPage
      title="Manage Menu"
      description="Add and update your delicious meal offerings."
      items={providerNavItems}
      loading={loading}
      action={
        !isFormOpen && (
          <Button
            onClick={() => setIsFormOpen(true)}
            className="rounded-md h-12 px-6 font-bold"
          >
            <Plus size={20} className="mr-2" />
            Add New Dish
          </Button>
        )
      }
    >
      {isFormOpen && (
        <Card className="border border-gray-100 shadow-md p-8 mb-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-10 w-10 bg-orange-50 rounded-md flex items-center justify-center text-orange-500">
              <ChefHat size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{editingMeal ? "Edit Meal" : "Add New Meal"}</h2>
          </div>

          <NewMealForm
            initialData={editingMeal || undefined}
            categories={categories}
            onSubmit={handleCreateOrUpdate}
            isLoading={isSubmitting}
            onCancel={() => { setIsFormOpen(false); setEditingMeal(null); }}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <Card key={meal.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                {meal.image ? (
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <ImageOff size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-lg bg-white/90"
                    onClick={() => { setEditingMeal(meal); setIsFormOpen(true); }}
                  >
                    <Edit size={14} className="text-gray-700" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-lg shadow-md"
                    onClick={() => handleDelete(meal.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                <div className="absolute bottom-2 left-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-lg font-bold text-orange-500">{formatCurrency(meal.price)}</span>
                </div>
              </div>

              <CardContent className="p-6 grow flex flex-col">
                <div className="space-y-1 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{meal.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-orange-500 uppercase">{meal.category?.name || 'Category'}</span>
                    <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                    <span className={cn("text-[10px] font-bold uppercase", meal.isAvailable ? "text-green-600" : "text-red-500")}>
                      {meal.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{meal.description}</p>

                <div className="pt-4 border-t border-gray-50 mt-auto flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-300 uppercase">ID: {meal.id.slice(0, 8)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="lg:col-span-3 py-24 text-center bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6 shadow-sm">
              <ChefHat size={40} />
            </div>
            <div className="space-y-2 mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Your menu is empty</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Start adding your delicious items to the shop.</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="rounded-md h-12 px-8 font-bold">
              Add Your First Dish
            </Button>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
