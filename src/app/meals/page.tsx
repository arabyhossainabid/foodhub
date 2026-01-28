"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal } from "@/types";
import { MealCard } from "@/components/meals/MealCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Utensils, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

import { Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function MealsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("categoryId") || "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCat) params.append("categoryId", selectedCat);

        const res = await api.get(`/meals?${params.toString()}`);
        setMeals(res.data.data);
      } catch (error) {
        console.error("Failed to fetch meals");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
    // Refresh AOS once components are likely rendered
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }, [searchTerm, selectedCat]);

  const toggleCategory = (id: string) => {
    const newCat = selectedCat === id ? "" : id;
    setSelectedCat(newCat);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newCat) params.set("categoryId", newCat);
    else params.delete("categoryId");
    router.push(`/meals?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 space-y-10 shrink-0">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <SlidersHorizontal size={20} className="mr-2 text-orange-500" />
              Filters
            </h3>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Search</label>
              <div className="relative">
                <Input
                  placeholder="Pizza, Burger..."
                  className="pl-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Categories</label>
                {selectedCat && (
                  <button onClick={() => toggleCategory("")} className="text-xs text-orange-500 font-bold flex items-center">
                    Clear <X size={12} className="ml-1" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all duration-300 ${selectedCat === cat.id
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCat === cat.id ? "bg-white/20" : "bg-gray-200"
                      }`}>
                      {cat._count?.meals || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Promo Card */}
          <div className="bg-[#1C1C1C] rounded-md p-8 text-white space-y-4 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500 rounded-full blur-2xl opacity-50"></div>
            <Utensils size={32} className="text-orange-500" />
            <h4 className="text-xl font-bold font-extra-bold">Join as a Provider</h4>
            <p className="text-sm text-gray-400 leading-relaxed">Grow your business with FoodHub. Start selling today!</p>
            <Link href="/register?role=PROVIDER" className="block">
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-orange-500 hover:border-orange-500">Apply Now</Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="grow space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-4xl font-black text-gray-900">
              {selectedCat ? categories.find(c => c.id === selectedCat)?.name : "All Delicious Meals"}
            </h1>
            <p className="text-sm font-bold text-gray-400">
              Found <span className="text-gray-900">{meals.length}</span> meals
            </p>
          </div>

          {meals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          ) : !loading && (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <Utensils size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No meals found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCat(""); }} variant="outline">Clear All Filters</Button>
            </div>
          )}

          {loading && <FullPageLoader transparent />}
        </main>
      </div>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <MealsContent />
    </Suspense>
  );
}
