"use client";

import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowRight, Star, Clock, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal } from "@/types";
import { useCart } from "@/context/CartContext";
import { MealCard } from "@/components/meals/MealCard";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, mealRes] = await Promise.all([
          api.get("/categories"),
          api.get("/meals?limit=4")
        ]);
        setCategories(catRes.data.data.slice(0, 6));
        setFeaturedMeals(mealRes.data.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch home data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#1C1C1C]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl space-y-8" data-aos="fade-right">
            <div className="inline-flex items-center space-x-2 bg-[#FF5200]/10 border border-[#FF5200]/20 rounded-full px-4 py-2 text-[#FF5200] font-bold text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5200] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5200]"></span>
              </span>
              <span>24/7 Delivery Available</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1]">
              Discover & Order <br />
              <span className="text-[#FF5200]">Delicious</span> Meals
            </h1>

            <p className="text-xl text-gray-300 max-w-xl">
              From local restaurants to your doorstep. The best food hub for customers, providers, and food lovers.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/meals">
                <Button size="lg" className="rounded-2xl w-full sm:w-auto">
                  Browse Menu <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/register?role=PROVIDER">
                <Button variant="outline" size="lg" className="rounded-2xl w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
                  Join as Provider
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">50k+</h3>
                <p className="text-gray-400 text-sm">Active Users</p>
              </div>
              <div className="w-px h-10 bg-gray-700"></div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">2k+</h3>
                <p className="text-gray-400 text-sm">Food Providers</p>
              </div>
              <div className="w-px h-10 bg-gray-700"></div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">4.9/5</h3>
                <p className="text-gray-400 text-sm">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div data-aos="fade-up">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-gray-500 max-w-lg">Find what you love from our wide range of categories. We have everything you need.</p>
          </div>
          <Link href="/meals">
            <Button variant="ghost" className="text-[#FF5200] font-bold">View All Categories</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <Link key={cat.id} href={`/meals?categoryId=${cat.id}`}>
              <Card
                className="group cursor-pointer border-none bg-gray-50 hover:bg-[#FF5200] transition-all duration-500 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#FF5200] group-hover:scale-110 shadow-sm transition-transform duration-500">
                    <UtensilsCrossed size={32} />
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-white transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-500 group-hover:text-orange-100 transition-colors">
                    {cat._count?.meals || 0} Meals
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16 space-y-4" data-aos="fade-up">
            <h2 className="text-5xl font-black text-gray-900">Featured On Our Menu</h2>
            <p className="text-gray-500 max-w-2xl text-lg">
              Handpicked selection of the most popular and delicious meals from our top providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMeals.map((meal, idx) => (
              <div key={meal.id} data-aos="fade-up" data-aos-delay={idx * 150}>
                <MealCard meal={meal} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FF5200]/10 rounded-full blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
              className="rounded-[3rem] shadow-2xl z-10 relative"
              alt="Why Choose Us"
            />
            <div className="absolute bottom-10 -right-10 bg-white p-8 rounded-4xl shadow-2xl z-20 space-y-2 hidden md:block" data-aos="zoom-in" data-aos-delay="500">
              <div className="flex items-center space-x-1 text-orange-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="font-bold text-xl">Best Service!</p>
              <p className="text-gray-500 text-sm italic">&quot;Amazing taste and speed!&quot;</p>
            </div>
          </div>

          <div className="space-y-10" data-aos="fade-left">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-gray-900 leading-tight">Why Food lovers <br /> <span className="text-[#FF5200]">Trust Us</span></h2>
              <p className="text-gray-500 text-lg">We provide a seamless experience for both customers and food providers, ensuring quality and transparency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Clock className="text-[#FF5200]" size={28} />, title: "Super Fast Delivery", desc: "Delivery within 30 minutes in most city areas." },
                { icon: <ShieldCheck className="text-[#FF5200]" size={28} />, title: "Quality Control", desc: "Every provider is verified by our admin team." },
                { icon: <MapPin className="text-[#FF5200]" size={28} />, title: "Live Tracking", desc: "Track your order status in real-time." },
                { icon: <UtensilsCrossed className="text-[#FF5200]" size={28} />, title: "Huge Menu", desc: "Over 500+ meals from 100+ top providers." }
              ].map((feature, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{feature.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}