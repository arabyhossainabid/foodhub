"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Utensils, ArrowRight, Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<(ProviderProfile & { user: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProviders = providers.filter(p =>
    p.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div data-aos="fade-up">
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Local <span className="text-gradient">Partners</span></h1>
          <p className="text-gray-500 font-medium text-lg mt-2">Discover the best culinary gems in your area.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search by restaurant or cuisine..."
            className="pl-11 h-14 rounded-2xl shadow-sm border-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" data-aos="fade-up">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="premium-card group hover:translate-y-[-10px] transition-all duration-500 overflow-hidden border-none shadow-xl shadow-gray-200/50">
              <CardContent className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF5200] group-hover:bg-[#FF5200] group-hover:text-white transition-all duration-500 shadow-sm">
                    <Store size={32} />
                  </div>
                  <div className="flex items-center text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-xl">
                    <Star size={16} fill="currentColor" className="mr-1.5" />
                    {provider.rating}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight line-clamp-1">{provider.shopName}</h3>
                  <div className="flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <Utensils size={14} className="mr-2" />
                    {provider.cuisine || "Multi-Cuisine"}
                  </div>
                </div>

                <div className="flex items-center text-gray-500 font-medium text-sm">
                  <MapPin size={16} className="mr-2 text-[#FF5200] shrink-0" />
                  <span className="line-clamp-1">{provider.address}</span>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <Link href={`/providers/${provider.id}`}>
                    <Button className="w-full h-12 rounded-2xl font-black group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                      View Menu <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
            <Store size={48} />
          </div>
          <h3 className="text-3xl font-black text-gray-900">No providers match your search</h3>
          <p className="text-gray-500 max-w-sm">Try searching for something else or browse all restaurants.</p>
          <Button variant="outline" onClick={() => setSearchTerm("")} className="rounded-xl">Clear All Filters</Button>
        </div>
      )}
    </div>
  );
}
