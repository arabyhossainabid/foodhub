"use client";

import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowRight, Star, Clock, ShieldCheck, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal } from "@/types";
import { MealCard } from "@/components/meals/MealCard";
import { cn } from "@/lib/utils";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, mealRes] = await Promise.all([
          api.get("/categories"),
          api.get("/meals?limit=8"),
        ]);
        setCategories(catRes.data.data.slice(0, 6));
        setFeaturedMeals(mealRes.data.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }, []);

  return (
    <div className="flex flex-col pb-32">
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/foodhub_banner_bg_1769511486315.png"
            alt="Delicious Food Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl space-y-10" data-aos="fade-right">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="h-2 w-2 bg-[#FF5200] rounded-full animate-pulse"></span>
              <span className="text-white text-xs font-black uppercase tracking-widest">Now Delivering to Your City</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              Delicious <br />
              <span className="text-[#FF5200]">Moments</span> <br />
              Delivered.
            </h1>

            <p className="text-xl text-gray-200 max-w-lg font-medium leading-relaxed">
              Experience gourmet dining from the comfort of your home. We bring the finest kitchens directly to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/meals" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-md h-16 px-10 text-lg font-black shadow-2xl shadow-orange-500/40 w-full hover:scale-105 transition-transform">
                  Explore Menu
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-md h-16 px-10 text-lg font-black border-white/30 text-white bg-white/5 backdrop-blur-md hover:bg-white hover:text-black w-full hover:scale-105 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-20 z-20">
        <div className="bg-white rounded-md shadow-2xl shadow-black/10 p-8 lg:p-16 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div data-aos="fade-up">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                Favorite <span className="text-[#FF5200]">Cuisines</span>
              </h2>
              <p className="text-gray-500 max-w-lg text-lg font-medium">
                Choose from our wide variety of dishes and find your perfect meal.
              </p>
            </div>
            <Link href="/meals">
              <Button variant="ghost" className="text-[#FF5200] font-black text-lg hover:bg-orange-50 rounded-md h-14 px-8">
                View All Categories
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/meals?categoryId=${cat.id}`}>
                <div className="bg-gray-50/50 border border-gray-100 p-8 flex flex-col items-center justify-center space-y-5 cursor-pointer group hover:bg-white hover:border-[#FF5200]/20 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 rounded-md">
                  <div className="h-20 w-20 bg-white rounded-md shadow-lg flex items-center justify-center text-[#FF5200] group-hover:bg-[#FF5200] group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <UtensilsCrossed size={36} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-center text-lg">
                    {cat.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-20 space-y-4">
            <div className="h-1.5 w-12 bg-[#FF5200] rounded-full"></div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight">Today&apos;s <span className="text-[#FF5200]">Featured</span> Selection</h2>
            <p className="text-gray-500 max-w-2xl text-xl font-medium leading-relaxed">
              Discover local favorites and trending dishes, hand-picked by our food experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {featuredMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {isLoading && <FullPageLoader transparent />}

          <div className="mt-20 text-center">
            <Link href="/meals">
              <Button size="lg" className="rounded-md h-16 px-12 text-lg font-black bg-gray-900 hover:bg-black shadow-xl">
                Explore Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {(!user || user.role === "CUSTOMER") && (
        <section className="container mx-auto px-4 py-32 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#FF5200]/10 rounded-md scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
                className="rounded-md shadow-3xl shadow-black/20 w-full object-cover h-[500px] lg:h-[650px] relative transition-transform duration-700 group-hover:scale-[1.02]"
                alt="Why Choose Us"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-md shadow-2xl border border-gray-100 hidden md:block" data-aos="fade-left">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 bg-green-50 rounded-md flex items-center justify-center text-green-500">
                    <Clock size={28} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">25 min</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Delivery</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-16">
              <div className="space-y-6">
                <span className="text-[#FF5200] font-black uppercase tracking-[0.2em] text-sm">Our Difference</span>
                <h2 className="text-6xl font-black text-gray-900 leading-[1.1]">We Focus on <br /> The <span className="text-[#FF5200]">Experience</span></h2>
                <p className="text-gray-500 text-xl font-medium leading-relaxed">
                  Beyond just delivery, we provide a seamless bridge between you and the culinary masters in your neighborhood.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { icon: <Clock size={28} />, title: "Hyper-Fast", desc: "Our delivery network ensures your food arrives while it's still piping hot." },
                  { icon: <ShieldCheck size={28} />, title: "Quality First", desc: "Every restaurant partner is rigorously vetted for taste and hygiene standards." },
                  { icon: <MapPin size={28} />, title: "Live Tracking", desc: "Watch your meal's journey from the kitchen to your table in real-time." },
                  { icon: <Search size={28} />, title: "Curated Content", desc: "Discover hidden gems and top-rated local favorites easily." }
                ].map((feature, idx) => (
                  <div key={idx} className="group flex flex-col space-y-5">
                    <div className="h-16 w-16 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 group-hover:bg-[#FF5200] group-hover:text-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
