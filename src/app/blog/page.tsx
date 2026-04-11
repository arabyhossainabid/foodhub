/* eslint-disable @next/next/no-img-element */
"use client";

import { Calendar, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BlogPost, metaService } from '@/services/metaService';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await metaService.getBlogs();
        setPosts(data);
      } catch {
        setPosts([]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Blog Hero */}
      <section className="bg-orange-500 py-32 text-center text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-80">Culinary Stories</p>
          <h1 className="text-5xl md:text-7xl font-black mb-10 leading-tight">Flavor & <span className="text-gray-900 italic">Flair</span></h1>
          <div className="max-w-xl mx-auto relative group">
            <Input
              placeholder="Search articles..."
              className="h-16 pl-8 pr-16 rounded-2xl border-none bg-white text-gray-900 font-bold placeholder:text-gray-400 shadow-2xl"
            />
            <Button className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 rounded-xl px-4">
              <Search size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-video rounded-[40px] overflow-hidden shadow-3xl">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200" alt="Featured Post" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-8">
              <span className="px-4 py-2 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-xl">Editor&apos;s Choice</span>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Mastering Global <br /> Flavors at Home</h2>
              <p className="text-gray-500 text-base leading-relaxed font-medium">
                Learn how to incorporate exotic spices and traditional techniques into your daily cooking without needing a professional kitchen.
              </p>
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-black text-gray-900">Julian Casablancas</p>
                  <p className="text-xs font-bold text-gray-400">Head of Culinary Innovations</p>
                </div>
              </div>
              <Link href="/blog/1">
                <Button className="h-14 px-8 rounded-2xl font-black bg-gray-950 hover:bg-orange-500 transition-all gap-4">
                  Read Story <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Stories</h3>
          <div className="flex justify-between items-end mb-16">
            <div className="grid grid-cols-2 gap-4">
              {['All', 'Recipes', 'Lifestyle', 'Events'].map(cat => (
                <button key={cat} className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-100 hover:bg-orange-500 hover:text-white transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                <div className="h-64 relative overflow-hidden">
                  <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-500">
                    {post.category}
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently published'}</span>
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">{post.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="flex items-center gap-3 text-sm font-black text-gray-900 hover:text-orange-500 transition-colors uppercase tracking-[0.2em] group/link">
                    Read More <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
