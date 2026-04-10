import { blogPosts } from '@/data/blogPosts';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailsPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.id === Number(id));

  if (!post) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to blog
        </Link>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[420px] object-cover rounded-3xl mb-8"
        />

        <div className="space-y-4">
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-orange-50 text-orange-600">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 leading-tight">{post.title}</h1>
          <p className="text-sm text-gray-500 font-medium">By {post.author} • {post.date}</p>
          <p className="text-lg text-gray-600 leading-relaxed">{post.content}</p>
        </div>
      </div>
    </section>
  );
}
