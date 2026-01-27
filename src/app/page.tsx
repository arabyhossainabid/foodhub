"use client";

import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowRight, Star, Clock, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, Meal, ProviderProfile } from "@/types";
import { MealCard } from "@/components/meals/MealCard";
import { motion } from "framer-motion";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [topProviders, setTopProviders] = useState<(ProviderProfile & { user: { name: string } })[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, mealRes, providerRes] = await Promise.all([
          api.get("/categories"),
          api.get("/meals?limit=4"),
          api.get("/providers")
        ]);
        setCategories(catRes.data.data.slice(0, 6));
        setFeaturedMeals(mealRes.data.data.slice(0, 4));
        setTopProviders(providerRes.data.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch home data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 scale-110 animate-pulse-slow">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30"
            alt="Hero Background"
          />
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-white"></div>

        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 text-white font-bold text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5200] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5200]"></span>
              </span>
              <span>Premium Food Delivery & Dashboard</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.95] tracking-tighter">
              Bite into <br />
              <span className="text-gradient">Perfection.</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
              Discover culinary excellence from top-rated restaurants, or join as a provider to grow your business on the most advanced food hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/meals">
                <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold shadow-2xl shadow-orange-500/40 w-full sm:w-auto">
                  Browse Menu <ArrowRight className="ml-2" size={24} />
                </Button>
              </Link>
              <Link href="/register?role=PROVIDER">
                <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm w-full sm:w-auto">
                  Partner with Us
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-12 pt-8">
              {[
                { label: "Active Users", value: "50k+" },
                { label: "Food Providers", value: "2k+" },
                { label: "Customer Rating", value: "4.9/5" }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div data-aos="fade-up">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Explore <span className="text-[#FF5200]">Flavors</span></h2>
            <p className="text-gray-500 max-w-lg text-lg font-medium">Curated selections for every mood and occasion.</p>
          </div>
          <Link href="/meals">
            <Button variant="ghost" className="text-[#FF5200] font-black text-lg hover:bg-orange-50 rounded-xl">View All Categories</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((cat, idx) => (
            <Link key={cat.id} href={`/meals?categoryId=${cat.id}`}>
              <motion.div
                whileHover={{ y: -10 }}
                className="premium-card p-10 flex flex-col items-center justify-center space-y-6 cursor-pointer group"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-[#FF5200] group-hover:bg-[#FF5200] group-hover:text-white transition-all duration-500 shadow-sm">
                  <UtensilsCrossed size={40} />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-gray-900 text-lg mb-1">
                    {cat.name}
                  </h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Options available
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="bg-[#F8F9FB] py-32 rounded-[4rem]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-20 space-y-4" data-aos="fade-up">
            <span className="text-[#FF5200] font-black uppercase tracking-[0.3em] text-xs">Chef&apos;s Choice</span>
            <h2 className="text-6xl font-black text-gray-900 tracking-tighter">Featured On Our Menu</h2>
            <p className="text-gray-500 max-w-2xl text-xl font-medium leading-relaxed">
              Handpicked selection of the most popular and delicious meals from our top-rated providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredMeals.map((meal, idx) => (
              <motion.div
                key={meal.id}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <MealCard meal={meal} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Providers Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div data-aos="fade-up">
            <h2 className="text-5xl font-black text-gray-900 tracking-tight">Top Rated <span className="text-[#FF5200]">Partners</span></h2>
            <p className="text-gray-500 max-w-lg text-lg font-medium">Exceptional culinary artists bringing joy to your door.</p>
          </div>
          <Link href="/providers">
            <Button variant="ghost" className="text-[#FF5200] font-black text-lg hover:bg-orange-50 rounded-xl">View All Providers</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {topProviders.map((provider, idx) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/providers/${provider.id}`}>
                <div className="premium-card p-10 group cursor-pointer hover:bg-[#FF5200] transition-all duration-700">
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF5200] group-hover:bg-white transition-all duration-500">
                      <Star size={32} />
                    </div>
                    <div className="bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-black text-gray-400 group-hover:bg-white/20 group-hover:text-white">
                      RATING {provider.rating}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-white transition-colors">{provider.shopName}</h3>
                  <p className="text-gray-500 font-medium group-hover:text-white/80 transition-colors line-clamp-1">{provider.address}</p>
                  <div className="mt-8 flex items-center text-[#FF5200] font-black text-sm group-hover:text-white">
                    EXPLORE KITCHEN <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative" data-aos="zoom-in">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FF5200]/10 rounded-full blur-[100px]"></div>
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
              className="rounded-[4rem] shadow-full z-10 relative premium-shadow border-[12px] border-white"
              alt="Why Choose Us"
            />
            <div className="absolute bottom-20 -right-10 glass p-10 rounded-[2.5rem] shadow-2xl z-20 space-y-4 hidden md:block" data-aos="fade-left" data-aos-delay="500">
              <div className="flex items-center space-x-1 text-orange-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <p className="font-black text-2xl text-gray-900 tracking-tight">Voted #1 App</p>
              <p className="text-gray-500 font-bold italic">&quot;Simply the best experience!&quot;</p>
            </div>
          </div>

          <div className="space-y-16" data-aos="fade-left">
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-gray-900 leading-[0.95] tracking-tighter">Why Foodies <br /> <span className="text-gradient">Choose Us</span></h2>
              <p className="text-gray-500 text-xl font-medium leading-relaxed">We combine cutting-edge technology with high-quality service to deliver more than just food.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { icon: <Clock className="text-[#FF5200]" size={36} />, title: "30 Min Delivery", desc: "Our localized network ensures your food arrives hot and fresh." },
                { icon: <ShieldCheck className="text-[#FF5200]" size={36} />, title: "Verified Kitchens", desc: "Rigorous quality checks for every restaurant on our portal." },
                { icon: <MapPin className="text-[#FF5200]" size={36} />, title: "Live Tracking", desc: "Real-time updates from order placement to your doorstep." },
                { icon: <UtensilsCrossed className="text-[#FF5200]" size={36} />, title: "Curated Menu", desc: "Access the most diverse food collection in your city." }
              ].map((feature, idx) => (
                <div key={idx} className="space-y-4 group">
                  <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FF5200] group-hover:text-white transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 tracking-tight">{feature.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
