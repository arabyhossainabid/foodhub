"use client";

import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowRight, Star, Clock, ShieldCheck, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mealService } from "@/services/mealService";
import { Category, Meal } from "@/types";
import { MealCard } from "@/components/meals/MealCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, mealsData] = await Promise.all([
          mealService.getCategories(),
          mealService.getMeals({ limit: 4 }),
        ]);

        setCategories(categoriesData.slice(0, 6));
        setFeaturedMeals(mealsData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const timer = setTimeout(() => {
      AOS.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col pb-32">
      <section className="relative h-[70vh] min-h-10/12 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/foodhub_banner.png"
            alt="Delicious Food Background"
            fill
            className="object-cover scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="container mx-auto md:px-4 px-1 z-10">
          <div className="max-w-3xl" data-aos="fade-right" suppressHydrationWarning>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Delicious <br />
              <span className="text-orange-500">Moments</span> <br />
              Delivered.
            </h1>

            <p className="text-md lg:text-xl pb-4 text-gray-200 max-w-lg font-medium leading-relaxed">
              Experience gourmet dining from the comfort of your home. We bring the finest kitchens directly to your doorstep.
            </p>

            <div className="flex items-center gap-2">
              <Link href="/meals" className="w-full sm:w-auto">
                <Button className="rounded-md text-md md:h-16 h-12 md:px-10 px-4 md:text-lg text-sm font-medium border-none text-white bg-white/5 backdrop-blur-md hover:bg-orange-500 hover:text-white w-full hover:scale-105 transition-all">
                  Explore Menu
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-md h-12 md:h-16 px-10 md:text-lg text-sm font-medium border-none text-white bg-white/5 backdrop-blur-md hover:bg-orange-500 hover:text-white w-full hover:scale-105 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto md:px-4 px-1 mt-20 z-20">
        <div className="rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div data-aos="fade-up" suppressHydrationWarning>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                Favorite <span className="text-orange-500">Cuisines</span>
              </h2>
              <p className="text-gray-500 max-w-lg text-lg font-medium">
                Choose from our wide variety of dishes and find your perfect meal.
              </p>
            </div>
            <Link href="/meals">
              <Button variant="ghost" className="hover:text-orange-500 text-lg font-bold rounded-md h-14 px-8">
                View All Categories
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/meals?categoryId=${cat.id}`}>
                <div className="bg-gray-50/50 border border-gray-100 p-8 flex flex-col items-center justify-center space-y-5 cursor-pointer group hover:bg-white hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 rounded-md">
                  <div className="h-20 w-20 bg-white rounded-md shadow-lg flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
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
            <div className="h-1.5 w-12 bg-orange-500 rounded-full"></div>
            <h2 className="md:text-5xl text-3xl font-bold text-gray-900 tracking-tight">Today&apos;s <span className="text-orange-500">Featured</span> Selection</h2>
            <p className="text-gray-500 max-w-2xl md:text-xl text-lg font-medium">
              Discover local favorites and trending dishes, hand-picked by our food experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {isLoading && featuredMeals.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-50 rounded-md animate-pulse"></div>
              ))
            ) : (
              featuredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))
            )}
          </div>

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
            <div className="relative group aspect-square md:aspect-auto md:min-h-11/12">
              <div className="absolute -inset-4 bg-orange-500/10 rounded-md scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 blur-2xl"></div>
              <Image
                src="/pizza.avif"
                fill
                className="rounded-md shadow-3xl shadow-black/20 object-cover relative transition-transform duration-700 group-hover:scale-[1.02]"
                alt="Why Choose Us"
              />

              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-md shadow-2xl border border-gray-100 hidden md:block" data-aos="fade-left" suppressHydrationWarning>
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
                <span className="text-orange-500 font-black uppercase tracking-widest text-sm">Our Difference</span>
                <h2 className="md:text-6xl text-4xl font-black text-gray-900 leading-tight">We Focus on <br /> The <span className="text-orange-500">Experience</span></h2>
                <p className="text-gray-500 md:text-xl text-lg font-medium leading-relaxed">
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
                    <div className="h-16 w-16 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-500/30">
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
