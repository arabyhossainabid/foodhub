"use client";

import { Meal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, ShieldCheck, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="relative h-56 overflow-hidden">
        <img
          src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={meal.title}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md font-bold text-orange-500 text-sm shadow-sm ring-1 ring-black/5">
          {formatCurrency(meal.price)}
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/meals/${meal.id}`}>
            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">
              {meal.title}
            </h3>
          </Link>
          <div className="flex items-center text-orange-500 shrink-0">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-sm font-bold text-gray-700">{meal.averageRating || 0}</span>
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-400 space-x-3 mb-2">
          <span className="flex items-center"><Clock size={12} className="mr-1" /> 20-30 min</span>
          <span className="flex items-center"><ShieldCheck size={12} className="mr-1" /> Quality</span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed h-10">
          {meal.description || "Fresh and delicious meal prepared with the best ingredients."}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Provider</span>
            <Link href={`/providers/${meal.providerId}`}>
              <span className="text-xs font-bold text-gray-700 hover:text-orange-500 transition-colors">{meal.provider?.shopName || meal.provider?.user.name || "FoodHub Kitchen"}</span>
            </Link>
          </div>
          <Button
            size="sm"
            className="rounded-md h-10 w-10 p-0"
            onClick={() => addToCart(meal)}
            title="Add to Cart"
          >
            <ShoppingBag size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
