"use client";

import { LayoutDashboard, Users, Grid, ShoppingBag, Star, Trash2, ShieldAlert, User as UserIcon, Calendar, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ManagementPage } from "@/components/dashboard/ManagementPage";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { title: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
  { title: "All Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { title: "Moderation", href: "/admin/reviews", icon: <ShieldAlert size={20} /> },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reviews");
      setReviews(res.data.data);
    } catch (error) {
      toast.error("Failed to load platform reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <ManagementPage
      title="Review Moderation"
      description="Oversee and manage customer feedback across the ecosystem."
      items={adminNavItems}
      loading={loading}
    >
      <div className="grid grid-cols-1 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="premium-card overflow-hidden border-none shadow-sm group hover:scale-[1.005] transition-all">
                <CardContent className="p-0 flex flex-col lg:flex-row">
                  {/* User & Rating */}
                  <div className="p-8 lg:w-64 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center text-gray-400 shadow-sm">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-none">{review.user?.name || "Anonymous"}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Reviewer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={cn(
                            s <= review.rating ? "text-orange-500 fill-orange-500" : "text-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-8 grow space-y-4">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <MessageSquare size={12} className="text-[#FF5200]" />
                      <span>Meal: {review.meal?.title || "Unknown Meal"}</span>
                    </div>
                    <p className="text-gray-600 font-medium italic leading-relaxed text-sm">
                      "{review.comment || "No comment provided by the user."}"
                    </p>
                    <div className="flex items-center space-x-6 pt-2">
                      <div className="flex items-center text-[10px] font-bold text-gray-400">
                        <Calendar size={12} className="mr-2" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-8 lg:w-48 flex items-center justify-center lg:justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-md font-black px-6 shadow-lg shadow-red-500/10"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <Star size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-900">No reviews found</h3>
            <p className="text-gray-500">The platform hasn't received any feedback yet.</p>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
