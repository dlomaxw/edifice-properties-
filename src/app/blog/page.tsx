import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog & News | Edifice Properties Uganda',
  description: 'Stay updated with construction progress, real estate investment advice, and homeownership tips in Kampala, Uganda.',
};

export const revalidate = 60; // Refresh blogs every minute

export default async function BlogPage() {
  const blogs = await db.blog.findMany({
    orderBy: { dateCreated: 'desc' },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Helper to remove HTML tags for card excerpts
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-[#020c1b] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col justify-end min-h-[180px]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
            News & Insights
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-2">
            Inside Edifice
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Stay updated with construction progress reports, expert real estate investment advisory, and guidelines for home ownership in Uganda.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="py-24 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6">
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/5 p-8 max-w-md mx-auto shadow-sm">
              <h3 className="font-heading font-bold text-lg text-zinc-400">No articles found</h3>
              <p className="text-xs text-zinc-500 mt-2">Check back soon for latest construction updates and property tips.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                >
                  <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#020c1b] text-[#dfc28c] text-[9px] font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-lg">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-semibold uppercase">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#dfc28c]" />
                          {formatDate(post.dateCreated)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#dfc28c]" />
                          {post.author}
                        </span>
                      </div>
                      
                      <h2 className="font-heading font-bold text-lg text-[#0a192f] group-hover:text-[#dfc28c] transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                        {stripHtml(post.content)}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-start">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-[#0a192f] hover:text-[#dfc28c] flex items-center gap-1.5 transition-colors group/link"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
