'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGenerateApp } from '../../hooks/useGenerateApp';
import { Compass, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const { generate, loading, error } = useGenerateApp();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() !== '') {
      generate(prompt);
    }
  };

  const handleTemplateClick = (slug: string) => {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    router.push(`/builder/${randomId}?template=${slug}`);
  };

  const quickTemplates = [
    { name: 'CRM Workspace', slug: 'crm-workspace', color: 'border-primary/30 text-primary hover:bg-primary/5' },
    { name: 'HR Dashboard', slug: 'hr-dashboard', color: 'border-accent-teal/30 text-accent-teal hover:bg-accent-teal/5' },
    { name: 'Admin Panel', slug: 'admin-panel', color: 'border-primary-light/30 text-primary-light hover:bg-primary-light/5' },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-bg-default grid-mesh py-16 px-4">
        <div className="max-w-2xl w-full bg-bg-card border border-border-default rounded-3xl p-8 md:p-12 shadow-xl relative z-10 text-center select-none">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            <Compass className="h-6 w-6 text-primary animate-pulse-slow" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-text-heading tracking-tight mb-2">
            What do you want to build?
          </h1>
          <p className="text-xs md:text-sm text-text-body font-semibold mb-8 leading-relaxed">
            Describe your internal dashboard, pipeline tracker, or operational support desk in plain language.
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="relative">
              <textarea
                rows={4}
                required
                disabled={loading}
                placeholder="Describe the application you want to build... (e.g., 'A support ticketing system to manage priority service requests and tracking logs')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-bg-subtle border border-border-default hover:border-primary/20 focus:border-primary focus:outline-none rounded-2xl p-4.5 text-xs md:text-sm font-semibold focus:ring-4 focus:ring-primary/10 text-text-heading disabled:opacity-70 transition-all resize-none shadow-sm"
              />
              <div className="absolute right-3.5 bottom-3.5 text-[10px] text-text-muted font-bold">
                {prompt.length}/500
              </div>
            </div>

            {error && (
              <div className="alert-error rounded-2xl p-4.5 text-left">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || prompt.trim() === ''}
              className="w-full btn-gradient-hero font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:border disabled:border-border-default"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Matching blueprint & structuring DB tables...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 fill-current" />
                  <span>Generate App</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Start Blueprints */}
          <div className="mt-10 border-t border-border-subtle pt-8">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-4">
              Or bootstrap instantly from a template
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {quickTemplates.map((tpl) => (
                <button
                  key={tpl.slug}
                  onClick={() => handleTemplateClick(tpl.slug)}
                  disabled={loading}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${tpl.color}`}
                >
                  {tpl.name}
                </button>
              ))}
              <Link
                href="/templates"
                className="px-4 py-2 text-xs font-bold rounded-xl border border-border-default bg-bg-card hover:bg-bg-subtle text-text-heading transition-all"
              >
                + More Blueprints
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function GeneratePageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <GeneratePage />
    </PageErrorBoundary>
  );
}
