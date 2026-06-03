'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Edit2, Trash2, Save, X, Eye, 
  Calendar, User, Tag, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

interface Blog {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  content: string;
  category: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  dateCreated: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View/Form states
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/assets/images/horizon.png');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Property updates');
  const [author, setAuthor] = useState('Edifice Properties Team');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tags, setTags] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to load blogs');
      const json = await res.json();
      if (json.success) {
        setBlogs(json.data);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenForm = (blog: Blog | null = null) => {
    setEditingBlog(blog);
    if (blog) {
      setTitle(blog.title);
      setSlug(blog.slug);
      setFeaturedImage(blog.featuredImage);
      setContent(blog.content);
      setCategory(blog.category);
      setAuthor(blog.author);
      setSeoTitle(blog.seoTitle || '');
      setSeoDescription(blog.seoDescription || '');
      setTags(blog.tags || '');
    } else {
      setTitle('');
      setSlug('');
      setFeaturedImage('/assets/images/horizon.png');
      setContent('');
      setCategory('Property updates');
      setAuthor('Edifice Properties Team');
      setSeoTitle('');
      setSeoDescription('');
      setTags('');
    }
    setView('form');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBlog) {
      // Auto slugify title
      const slugified = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(slugified);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      slug,
      featuredImage,
      content,
      category,
      author,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.replace(/<[^>]+>/g, '').substring(0, 160),
      tags,
    };

    try {
      let res;
      if (editingBlog) {
        // Edit Blog via PUT
        res = await fetch(`/api/blogs/${editingBlog.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create Blog via POST
        res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to save blog post');
      }

      await fetchBlogs();
      setView('list');
    } catch (err: any) {
      alert(err.message || 'Error saving blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (blogSlug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blogSlug}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete blog post');
      
      setBlogs(blogs.filter(b => b.slug !== blogSlug));
    } catch (err: any) {
      alert(err.message || 'Error deleting blog post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper to remove HTML tags for card excerpts
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              view === 'list' 
                ? 'bg-[#dfc28c] text-[#020c1b]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Insights Directory
          </button>
        </div>
        
        {view === 'list' && (
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus size={14} />
            <span>New Article</span>
          </button>
        )}
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-semibold">{error}</div>}

      {/* VIEW: Blog List */}
      {view === 'list' && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-[#dfc28c]" size={36} />
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading articles...</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-zinc-900 border border-white/5 p-16 text-center text-xs text-zinc-500 uppercase tracking-widest font-bold rounded-3xl">
              No blog posts created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between shadow-md"
                >
                  <div className="p-5 flex flex-col gap-4">
                    <span className="text-[9px] uppercase tracking-wider text-[#dfc28c] font-bold">
                      {blog.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-white line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                      {stripHtml(blog.content)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider border-t border-white/5 pt-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(blog.dateCreated)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {blog.author}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/30 px-5 py-4 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </a>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenForm(blog)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-white/5"
                        title="Edit Article"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.slug)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10"
                        title="Delete Article"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW: Blog Form */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-md max-w-4xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-base text-white">
              {editingBlog ? `Edit Article: ${editingBlog.title}` : 'Draft New Article'}
            </h3>
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Article Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Why Investing in Bugolobi Real Estate Yields High Returns"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">URL path Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="why-investing-in-bugolobi"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Author Name</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Edifice Properties Team"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Category Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              >
                <option value="Property updates">Property updates</option>
                <option value="Construction updates">Construction updates</option>
                <option value="Investment advice">Investment advice</option>
                <option value="Homeownership tips">Homeownership tips</option>
                <option value="Company news">Company news</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Featured Image Path</label>
              <ImageUploader
                value={featuredImage}
                onChange={setFeaturedImage}
                placeholder="/assets/images/horizon.png"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Comma Separated Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Bugolobi, Investment, Kampala, Luxury Real Estate"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-white/5 pt-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#dfc28c]">SEO Configuration</h4>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Why Invest in Bugolobi Real Estate | Kampala Property Guide"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SEO Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Short meta description summarising this article for search engine queries..."
                rows={2}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-white/5 pt-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Article Content (Supports HTML markup tags)</label>
                <span className="text-[9px] text-zinc-600 font-bold uppercase">Use &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt; tags</span>
              </div>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p>Write your article paragraphs here...</p><h3>Subheading</h3><p>Details...</p>"
                rows={12}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] font-mono leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {submitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Publish Article</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
