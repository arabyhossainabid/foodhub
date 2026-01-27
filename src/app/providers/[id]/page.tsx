"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { Meal, ProviderProfile } from "@/types";
import { MealCard } from "@/components/meals/MealCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Utensils, ArrowLeft, Info, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [provider, setProvider] = useState<ProviderProfile & { user: { name: string } } | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providerRes, mealsRes] = await Promise.all([
          api.get(`/providers/${id}`),
          api.get(`/meals?providerId=${id}`)
        ]);
        setProvider(providerRes.data.data);
        setMeals(mealsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch provider data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5200]"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <h1 className="text-4xl font-black text-gray-900">Provider not found</h1>
        <Link href="/meals">
          <Button variant="outline">Browse All Meals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Hero Header */}
      <section className="relative h-[40vh] bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Provider Background"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>

        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12">
          <Link href="/meals" className="text-white/60 hover:text-white font-bold mb-8 flex items-center transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Discover
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <span className="bg-[#FF5200] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">Top Rated Provider</span>
                <div className="flex items-center text-orange-400">
                  <Star size={14} fill="currentColor" />
                  <span className="ml-1 text-sm font-bold text-white">{provider.rating}</span>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter"
              >
                {provider.shopName}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center text-gray-300 font-medium"
              >
                <MapPin size={18} className="mr-2 text-[#FF5200]" /> {provider.address}
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <Button size="lg" className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-orange-500/20">
                <Info className="mr-2" size={20} /> About Shop
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div data-aos="fade-up">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Cuisines by <span className="text-[#FF5200]">{provider.user?.name}</span></h2>
            <p className="text-gray-500 font-medium text-lg mt-2">Explore the signature dishes and culinary arts of this provider.</p>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center text-sm font-bold text-gray-500 shadow-sm">
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-xl text-gray-900">
              <Utensils size={16} className="mr-2" /> All Dishes
            </div>
          </div>
        </div>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10" data-aos="fade-up">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No items on the menu yet</h3>
            <p className="text-gray-500 max-w-sm">This provider is currently preparing their selection. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
