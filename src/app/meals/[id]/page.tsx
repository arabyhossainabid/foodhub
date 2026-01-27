"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Meal, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, ShieldCheck, ShoppingBag, ArrowLeft, Utensils, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function MealDetailsPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMealData = async () => {
      setLoading(true);
      try {
        const [mealRes, reviewRes] = await Promise.all([
          api.get(`/meals/${id}`),
          api.get(`/reviews/meal/${id}`)
        ]);
        setMeal(mealRes.data.data);
        setReviews(reviewRes.data.data);
      } catch (error) {
        toast.error("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };
    fetchMealData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-[#FF5200] border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Meal not found</h1>
        <Link href="/meals">
          <Button className="mt-4">Back to Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/meals" className="text-[#FF5200] font-bold flex items-center mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowLeft size={18} className="mr-2" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image */}
        <div className="space-y-6" data-aos="fade-right">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 relative">
            <img
              src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"}
              className="w-full h-full object-cover"
              alt={meal.title}
            />
            {!meal.isAvailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xl">Unavailable</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-3xl bg-gray-100 overflow-hidden cursor-pointer hover:ring-4 ring-[#FF5200] transition-all">
                <img src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"} className="w-full h-full object-cover opacity-50" alt="Thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-10" data-aos="fade-left">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FF5200]">{meal.category?.name || "Delicious Meal"}</span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">{meal.title}</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl font-bold">
                <Star size={18} fill="currentColor" className="mr-1.5" />
                <span>{meal.averageRating || 0} ({reviews.length} Reviews)</span>
              </div>
              <div className="flex items-center text-gray-400 font-bold text-sm">
                <Clock size={18} className="mr-1.5" />
                <span>20 - 30 MIN</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed">{meal.description || "Indulge in this handcrafted culinary masterpiece. Prepared with the finest locally sourced ingredients, this meal promised an explosion of flavors and a truly satisfying dining experience."}</p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-widest text-gray-400">Price</span>
              <span className="text-4xl font-black text-[#FF5200]">{formatCurrency(meal.price)}</span>
            </div>
            <Button
              size="lg"
              className="w-full h-16 rounded-2xl text-xl shadow-xl shadow-orange-500/20"
              onClick={() => addToCart(meal)}
              disabled={!meal.isAvailable}
            >
              <ShoppingBag size={24} className="mr-3" /> {meal.isAvailable ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          <Card className="border-none bg-gray-50 rounded-3xl p-6">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#FF5200] shadow-sm">
                <Utensils size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Provided By</p>
                <p className="text-xl font-bold text-gray-900">{meal.provider?.user.name || "FoodHub Kitchen"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-32 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
          <h2 className="text-4xl font-black text-gray-900">Guest Reviews</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 font-bold">Total {reviews.length} feedback</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, idx) => (
              <Card key={review.id} className="border-none shadow-md p-8 bg-gray-50/50 rounded-4xl group hover:bg-white transition-all duration-500" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-[#FF5200] rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                        {review.user?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.user?.name}</p>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-orange-500">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-bold font-medium italic">&quot;{review.comment || "No comment provided."}&quot;</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <Star size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">No reviews yet</h3>
            <p className="text-gray-400">Be the first to order and leave a review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
