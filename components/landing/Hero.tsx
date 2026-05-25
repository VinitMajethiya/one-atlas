'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Compass, Loader2, Sparkles } from 'lucide-react';
import { useGenerateApp } from '@/hooks/useGenerateApp';

export function Hero() {
  const [prompt, setPrompt] = useState('');
  const { generate, loading, error } = useGenerateApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() !== '') {
      generate(prompt);
    }
  };

  const handleExampleClick = (val: string) => {
    setPrompt(val);
  };

  const examples = [
    'CRM for sales deals',
    'employee onboarding checklist',
    'inventory warehouse tracker',
    'support ticket helpdesk',
  ];

  return (
    <div className="relative overflow-hidden bg-bg-default grid-mesh pt-20 pb-16 md:pt-32 md:pb-28">
      <div className="hero-gradient-bar absolute top-0 left-0 right-0 z-20" aria-hidden />
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none dark:bg-primary/5" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-accent-pink/10 rounded-full blur-[90px] pointer-events-none dark:bg-accent-pink/5" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-accent-cyan/10 rounded-full blur-[90px] pointer-events-none dark:bg-accent-cyan/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 bg-accent-lavender text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-light px-3.5 py-1 rounded-full text-xs font-bold mb-8 animate-fade-in-up">
          <Compass className="h-3.5 w-3.5 animate-spin-slow" />
          <span>Introducing OneAtlas 2.4 — Schema Builder Live</span>
        </div>

        {/* Headings */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-heading max-w-4xl mx-auto leading-none mb-6 animate-fade-in-up">
          Build operational apps at the speed of <span className="text-gradient-hero">thought.</span>
        </h1>

        <p className="text-base md:text-xl text-text-body max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in-up">
          Generate secure, database-backed CRMs, HR dashboards, and internal workflows from templates or simple natural language prompts. Ready to deploy in seconds.
        </p>

        {/* Action Prompt Form */}
        <div className="max-w-xl mx-auto mb-10 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-bg-card border border-border-default hover:border-primary/20 focus-within:border-primary p-2 rounded-2xl shadow-md transition-all">
            <input
              type="text"
              disabled={loading}
              placeholder="Describe the app you want to build..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow bg-transparent px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none text-text-heading disabled:opacity-75"
            />
            <button
              type="submit"
              disabled={loading || prompt.trim() === ''}
              className="btn-gradient-hero font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 disabled:border disabled:border-border-default"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 fill-current" />
              )}
              <span>{loading ? 'Building...' : 'Generate'}</span>
            </button>
          </form>

          {error && (
            <div className="alert-error mt-3 text-left">
              {error}
            </div>
          )}

          {/* Prompt Suggestion Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs font-semibold text-text-body items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Try:</span>
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExampleClick(ex)}
                disabled={loading}
                className="bg-bg-subtle hover:bg-bg-muted border border-border-default/80 px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold cursor-pointer"
              >
                &quot;{ex}&quot;
              </button>
            ))}
          </div>
        </div>

        {/* Mock Interface Preview Container */}
        <div className="mt-16 md:mt-20 border border-border-default bg-bg-card rounded-2xl shadow-2xl p-2 md:p-3 max-w-5xl mx-auto animate-fade-in-up">
          <div className="bg-bg-subtle rounded-xl overflow-hidden border border-border-subtle aspect-video relative flex flex-col items-center justify-center group">
            {/* Mock screenshot placeholder */}
            <div className="absolute inset-0 bg-cover bg-center opacity-90 dark:opacity-75" style={{ backgroundImage: `url('/dashboard_preview.png')` }} />
            
            {/* Visual Interface Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-default/80 to-transparent flex flex-col justify-end p-6 md:p-10 text-left">
              <div className="max-w-md">
                <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1 block">Visual State Engine</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-text-heading mb-2">Schema-driven canvas controls</h3>
                <p className="text-xs md:text-sm text-text-body font-medium">
                  Watch database columns, form fields, and chart configurations build and sync in real-time as you drag nodes.
                </p>
              </div>
            </div>
            
            {/* Hover overlay play button */}
            <div className="relative z-10 p-5 rounded-full bg-gradient-hero text-white shadow-lg group-hover:scale-110 transition-transform duration-350 cursor-pointer">
              <Play className="h-8 w-8 fill-current ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
