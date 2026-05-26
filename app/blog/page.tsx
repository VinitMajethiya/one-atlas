'use client';

import React, { useState } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import { BLOG_POSTS } from '../../data/blog';
import { Badge } from '../../components/shared/Badge';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Engineering', 'Design', 'AI Native'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        
        {/* Blog Hero */}
        <SectionWrapper className="bg-bg-default grid-mesh pt-20 pb-12 text-center">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Atlas Notebook</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-heading mb-6 tracking-tight">
              Engineering, Design & AI Native Insights
            </h1>
            <p className="text-base md:text-lg text-text-body font-medium max-w-xl mx-auto">
              Follow company news, internal tooling architecture patterns, and our latest product update announcements.
            </p>
          </div>
        </SectionWrapper>

        {/* Categories Toggles & Card Grid */}
        <SectionWrapper className="bg-bg-default pt-0 pb-24">
          
          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-bg-card text-text-body border-border-default hover:bg-bg-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm hover:border-primary/20 transition-standard flex flex-col justify-between"
              >
                <div className="p-6 text-left">
                  {/* Category & Read Time */}
                  <div className="flex justify-between items-center mb-4">
                    <Badge label={post.category} />
                    <span className="text-xs text-text-muted font-bold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-text-heading text-lg md:text-xl mb-3 leading-snug hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-text-body font-semibold line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="text-xs font-semibold text-text-muted space-y-1">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border-subtle p-6 bg-bg-subtle/50 text-left">
                  <button
                    onClick={() => alert(`Full article content: \n\n${post.content}`)}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-light transition-colors"
                  >
                    <span>Read full article</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-text-muted font-bold">
              No posts found in this category.
            </div>
          )}

        </SectionWrapper>

      </main>
      <Footer />
    </>
  );
}
