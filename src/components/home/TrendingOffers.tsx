"use client";

import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { metaService } from '@/services/metaService';

export function TrendingOffers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await metaService.getOffers();
        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch trending offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <section className="py-24 bg-white" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl" data-aos="fade-right">
            <div className="flex items-center gap-2 text-orange-500 font-bold mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-[0.2em] text-xs">FLASH DEALS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 leading-tight tracking-tight">
              Best <span className="text-orange-500 italic">Offers</span> of the Week
            </h2>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0 font-bold border-2 rounded-xl h-12 px-8 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
            View All Offers
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-50 rounded-[2rem] animate-pulse border border-gray-100"></div>
            ))
          ) : offers.map((offer, index) => (
            <div 
              key={offer.id || index} 
              className="group relative overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/5 h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute top-6 left-6 ${offer.color || 'bg-orange-500'} text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg`}>
                  {offer.tag}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-950 mb-3 tracking-tight leading-tight">{offer.title}</h3>
                <p className="text-gray-500 font-medium mb-8 line-clamp-2 text-sm leading-relaxed flex-1">{offer.description}</p>
                <Button className="w-full h-12 bg-gray-950 hover:bg-orange-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-xl shadow-gray-200">
                  Claim Offer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
