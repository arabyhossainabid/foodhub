"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative" data-aos="zoom-in">
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative h-32 w-32 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/50">
          <CheckCircle size={64} strokeWidth={3} />
        </div>
      </div>

      <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
        <h1 className="text-5xl font-black text-gray-900">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-500 max-w-lg mx-auto">
          Thank you for your order. Your meal is being prepared and will be delivered soon.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md" data-aos="fade-up" data-aos-delay="400">
        <Link href="/orders">
          <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 border-gray-200 text-gray-700">
            <Package size={20} className="mr-2" /> View My Orders
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="w-full rounded-2xl h-14">
            <Home size={20} className="mr-2" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="pt-12" data-aos="fade-up" data-aos-delay="600">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center">
          What&apos;s Next? <ArrowRight size={14} className="ml-2" />
        </p>
        <div className="flex flex-col md:flex-row items-center gap-8 mt-6">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold">1</div>
            <p className="text-sm text-gray-600 font-medium text-left">Provider accepts <br /> your order</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold">2</div>
            <p className="text-sm text-gray-600 font-medium text-left">Meal is prepared <br /> and packed</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold">3</div>
            <p className="text-sm text-gray-600 font-medium text-left">Delivered to your <br /> doorstep</p>
          </div>
        </div>
      </div>
    </div>
  );
}
