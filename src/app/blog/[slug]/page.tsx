import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, User, ArrowLeft, ArrowRight, Tag } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blog.findUnique({
    where: { slug },
  });

  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.seoTitle} | Edifice Properties Uganda`,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      images: [{ url: post.featuredImage }],
    },
  };
}

// Generate static params for blogs
export async function generateStaticParams() {
  const posts = await db.blog.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  const post = await db.blog.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // Load other latest blogs as recommended (excluding current)
  const recommendations = await db.blog.findMany({
    where: { NOT: { id: post.id } },
    orderBy: { dateCreated: 'desc' },
    take: 2,
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const tagsList = post.tags ? post.tags.split(',').map((t) => t.trim()) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Article Cover Hero */}
      <section className="relative pt-36 pb-20 bg-[#020c1b] text-white border-b border-white/5 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col gap-4">
          <Link 
            href="/blog"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors self-start uppercase tracking-wider font-semibold mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Insights</span>
          </Link>
          
          <span className="px-3 py-1 bg-[#dfc28c]/15 text-[#dfc28c] text-[9px] font-bold uppercase tracking-wider rounded-full border border-[#dfc28c]/30 self-start">
            {post.category}
          </span>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-[1.15] text-white">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-[11px] text-white/50 font-semibold uppercase mt-2 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#dfc28c]" />
              {formatDate(post.dateCreated)}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-[#dfc28c]" />
              {post.author}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm p-6 md:p-12">
            
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-black/5 mb-10">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content html body */}
            <div 
              className="prose prose-zinc max-w-none text-zinc-600 text-sm leading-relaxed space-y-6
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#0a192f]
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-2
                prose-strong:text-[#0a192f] prose-strong:font-bold
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags footer */}
            {tagsList.length > 0 && (
              <div className="flex items-center flex-wrap gap-2.5 mt-12 pt-8 border-t border-black/5">
                <Tag size={14} className="text-[#dfc28c]" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tags:</span>
                {tagsList.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded-md border border-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Reads */}
      {recommendations.length > 0 && (
        <section className="py-20 bg-[#020c1b] text-white border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="font-heading font-bold text-2xl mb-10 text-center md:text-left">
              Recommended Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-[#dfc28c]/30 transition-all flex flex-col group"
                >
                  <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                    <Image
                      src={rec.featuredImage}
                      alt={rec.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-[#dfc28c] uppercase tracking-wider font-semibold">
                        {rec.category}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white group-hover:text-[#dfc28c] transition-colors leading-snug">
                        <Link href={`/blog/${rec.slug}`}>{rec.title}</Link>
                      </h4>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-white/40">{formatDate(rec.dateCreated)}</span>
                      <Link 
                        href={`/blog/${rec.slug}`}
                        className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1 group/link"
                      >
                        <span>Read</span>
                        <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <StickyCTAs />
    </div>
  );
}
