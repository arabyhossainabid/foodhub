"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { User, ProviderProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, UtensilsCrossed, Star, ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/providers");
        setProviders(res.data.data);
      } catch (error) {
        console.error("Failed to fetch providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-16 space-y-4">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Our <span className="text-[#FF5200]">Kitchens</span></h1>
        <p className="text-gray-500 max-w-2xl text-lg font-medium">Discover the best local providers and their unique culinary offerings.</p>
      </div>

      {loading && <FullPageLoader transparent />}

      {providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <Link key={provider.id} href={`/providers/${provider.id}`}>
              <Card className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white h-full flex flex-col">
                <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent"></div>
                  <Store size={64} className="text-orange-200 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-6 left-6 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-sm">
                    <Star size={14} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-gray-700">Top Rated</span>
                  </div>
                </div>

                <CardContent className="p-10 space-y-6 grow flex flex-col">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#FF5200] transition-colors">{provider.shopName}</h3>
                    <div className="flex items-center text-gray-400 font-bold text-sm">
                      <MapPin size={16} className="mr-2 text-[#FF5200] shrink-0" />
                      <span className="truncate">{provider.address}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed grow">
                    {provider.cuisine || "Specializing in handcrafted meals prepared with fresh, local ingredients. Order now to experience the taste of brilliance."}
                  </p>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-[#FF5200]">
                        <UtensilsCrossed size={16} />
                      </div>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Explore Menu</span>
                    </div>
                    <ArrowRight size={20} className="text-[#FF5200] transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <Store size={64} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900">No kitchens found</h3>
          <p className="text-gray-500">We're currently expanding. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
