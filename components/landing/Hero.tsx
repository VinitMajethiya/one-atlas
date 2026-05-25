import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Compass } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-bg-default grid-mesh pt-20 pb-16 md:pt-32 md:pb-28">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none dark:bg-primary/5" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-accent-pink/10 rounded-full blur-[90px] pointer-events-none dark:bg-accent-pink/5" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-accent-cyan/10 rounded-full blur-[90px] pointer-events-none dark:bg-accent-cyan/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-light px-3.5 py-1 rounded-full text-xs font-bold mb-8 animate-fade-in-up">
          <Compass className="h-3.5 w-3.5 animate-spin-slow" />
          <span>Introducing OneAtlas 2.4 — Schema Builder Live</span>
        </div>

        {/* Headings */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-heading max-w-4xl mx-auto leading-none mb-6 animate-fade-in-up">
          Build operational apps at the speed of <span className="bg-gradient-to-r from-primary via-accent-pink to-accent-orange bg-clip-text text-transparent">thought.</span>
        </h1>

        <p className="text-base md:text-xl text-text-body max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in-up">
          Generate secure, database-backed CRMs, HR dashboards, and internal workflows from templates or simple natural language prompts. Ready to deploy in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up">
          <Link
            href="/templates"
            className="group w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Start Building</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/templates"
            className="w-full sm:w-auto bg-bg-card hover:bg-bg-subtle text-text-heading border border-border-default font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4 fill-current text-text-muted" />
            <span>Browse Templates</span>
          </Link>
        </div>

        {/* Mock Interface Preview Container */}
        <div className="mt-16 md:mt-20 border border-border-default bg-bg-card rounded-2xl shadow-2xl p-2 md:p-3 max-w-5xl mx-auto animate-fade-in-up">
          <div className="bg-bg-subtle rounded-xl overflow-hidden border border-border-subtle aspect-video relative flex flex-col items-center justify-center group">
            {/* Mock screenshot placeholder */}
            <div className="absolute inset-0 bg-cover bg-center opacity-90 dark:opacity-75" style={{ backgroundImage: `url('/api/placeholder/1000/600')` }} />
            
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
            <div className="relative z-10 p-5 rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-350 cursor-pointer">
              <Play className="h-8 w-8 fill-current ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
