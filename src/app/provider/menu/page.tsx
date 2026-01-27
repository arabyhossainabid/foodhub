"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  LayoutDashboard,
  Utensils,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  ImageOff,
  ChefHat,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { NewMealForm } from "@/components/provider/NewMealForm";
import { motion, AnimatePresence } from "framer-motion";

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
    <DashboardLayout items={providerNavItems}>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Kitchen <span className="text-gradient">Gallery</span></h1>
            <p className="text-gray-500 font-medium">Curate and manage your culinary offerings for the world.</p>
          </div>
          {!isFormOpen && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="rounded-[1.5rem] h-14 px-8 font-black shadow-xl shadow-orange-500/20 group"
            >
              <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add New Dish
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isFormOpen ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="premium-card p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5200]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF5200]">
                      <ChefHat size={24} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">{editingMeal ? "Refine Your Dish" : "Create a Masterpiece"}</h2>
                  </div>

                  <NewMealForm
                    initialData={editingMeal || undefined}
                    categories={categories}
                    onSubmit={handleCreateOrUpdate}
                    isLoading={isSubmitting}
                    onCancel={() => { setIsFormOpen(false); setEditingMeal(null); }}
                  />
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
                ))
              ) : meals.length > 0 ? (
                meals.map((meal, idx) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="premium-card group overflow-hidden border-none h-full flex flex-col">
                      <div className="relative h-60 overflow-hidden">
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                            <ImageOff size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute top-4 right-4 flex space-x-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="glass h-10 w-10 rounded-xl"
                            onClick={() => { setEditingMeal(meal); setIsFormOpen(true); }}
                          >
                            <Edit size={18} className="text-gray-700" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-10 w-10 rounded-xl shadow-lg"
                            onClick={() => handleDelete(meal.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>

                        <div className="absolute bottom-4 left-4 glass px-5 py-2.5 rounded-2xl shadow-xl">
                          <span className="text-xl font-black text-[#FF5200]">{formatCurrency(meal.price)}</span>
                        </div>
                      </div>

                      <CardContent className="p-8 grow space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{meal.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-[#FF5200] uppercase tracking-[0.2em]">{meal.category?.name || 'Signature'}</span>
                            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{meal.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">{meal.description}</p>

                        <div className="pt-6 flex items-center justify-between border-t border-gray-50 mt-auto">
                          <div className="flex items-center -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black">S{i}</div>)}
                          </div>
                          <span className="text-[9px] font-black text-gray-300 tracking-widest uppercase">ID: {meal.id.slice(0, 8)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="lg:col-span-3 py-40 text-center bg-white rounded-[4rem] border-2 border-gray-50 border-dashed relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 space-y-8">
                    <div className="h-24 w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto group-hover:scale-110 transition-transform duration-500">
                      <ChefHat size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight">Your Kitchen is Silent</h3>
                      <p className="text-gray-400 font-medium max-w-sm mx-auto">Upload your signature dishes and let the world experience your culinary art.</p>
                    </div>
                    <Button onClick={() => setIsFormOpen(true)} className="rounded-2xl h-14 px-10 font-black">
                      Ignite the Stove <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
