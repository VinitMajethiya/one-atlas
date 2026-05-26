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
    <div className="relative overflow-hidden bg-[#F5F5EE] pt-20 pb-16 md:pt-32 md:pb-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Copy & CTA */}
          <div>
            {/* Release Pill */}
            <div className="inline-flex items-center gap-2 bg-[#F5F5EE] text-[#FF6600] border border-[#E5E7EB] px-3.5 py-1 rounded-[var(--radius-sm)] text-xs font-bold mb-8 animate-fade-in-up">
              <Compass className="h-3.5 w-3.5" />
              <span>Introducing OneAtlas 2.4 — Schema Builder Live</span>
            </div>

            {/* Headings */}
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold leading-[0.95] tracking-[-0.04em] text-[#111111] mb-6 animate-fade-in-up">
              Build operational apps at the speed of <span className="text-[#FF6600]">thought.</span>
            </h1>

            <p className="text-[18px] leading-[1.7] font-normal text-[#6B7280] max-w-xl mb-10 animate-fade-in-up">
              Generate secure, database-backed CRMs, HR dashboards, and internal workflows from templates or simple natural language prompts. Ready to deploy in seconds.
            </p>

            {/* Action Prompt Form */}
            <div className="max-w-xl mb-10 animate-fade-in-up">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-white border border-[#E5E7EB] hover:border-[#FFB380] focus-within:border-[#FF6600] p-2 rounded-[28px] shadow-standard transition-standard">
                <input
                  type="text"
                  disabled={loading}
                  placeholder="Describe the app you want to build..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-grow bg-transparent px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none text-[#111111] disabled:opacity-75"
                />
                <button
                  type="submit"
                  disabled={loading || prompt.trim() === ''}
                  className="btn-primary font-bold text-xs md:text-sm px-6 py-3 flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="bg-[#F5F5EE] text-[#FF6600] border border-[#E5E7EB] mt-3 p-4 rounded-[var(--radius-sm)] text-xs font-bold leading-relaxed text-left">
                  {error}
                </div>
              )}

              {/* Prompt Suggestion Chips */}
              <div className="flex flex-wrap justify-start gap-2 mt-4 text-xs font-semibold text-[#6B7280] items-center">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Try:</span>
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => handleExampleClick(ex)}
                    disabled={loading}
                    className="bg-[#F5F5EE] hover:bg-[#ECEEE7] border border-[#E5E7EB] px-2.5 py-1 rounded-lg transition-standard text-[11px] font-bold cursor-pointer"
                  >
                    &quot;{ex}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Mock Interface Preview */}
          <div className="animate-fade-in-up">
            <div className="border border-[#E5E7EB] bg-white rounded-[var(--radius-lg)] shadow-standard p-2 md:p-3">
              <div className="bg-[#F5F5EE] rounded-[var(--radius-md)] overflow-hidden border border-[#E5E7EB] aspect-video relative flex flex-col items-center justify-center group">
                {/* Mock screenshot placeholder */}
                <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: `url('/dashboard_preview.png')` }} />
                
                {/* Visual Interface Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5EE]/80 to-transparent flex flex-col justify-end p-6 md:p-10 text-left">
                  <div className="max-w-md">
                    <span className="text-[12px] font-semibold text-[#FF6600] uppercase tracking-[0.08em] mb-1 block">Visual State Engine</span>
                    <h3 className="text-xl md:text-2xl font-bold text-[#111111] mb-2">Schema-driven canvas controls</h3>
                    <p className="text-xs md:text-sm text-[#6B7280] font-normal">
                      Watch database columns, form fields, and chart configurations build and sync in real-time as you drag nodes.
                    </p>
                  </div>
                </div>
                
                {/* Hover overlay play button */}
                <div className="relative z-10 p-5 rounded-full bg-[#FF6600] text-white shadow-standard group-hover:scale-110 transition-standard cursor-pointer">
                  <Play className="h-8 w-8 fill-current ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
