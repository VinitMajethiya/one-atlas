'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Users, Sliders, BarChart2, Package, HelpCircle, Eye, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../../data/templates';
import { Badge } from '../shared/Badge';

export function TemplatesShowcase() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="h-5 w-5 text-indigo-500" />;
      case 'Users': return <Users className="h-5 w-5 text-teal-500" />;
      case 'Sliders': return <Sliders className="h-5 w-5 text-amber-500" />;
      case 'BarChart2': return <BarChart2 className="h-5 w-5 text-rose-500" />;
      case 'Package': return <Package className="h-5 w-5 text-orange-500" />;
      case 'HelpCircle': return <HelpCircle className="h-5 w-5 text-sky-500" />;
      default: return <Briefcase className="h-5 w-5 text-primary" />;
    }
  };

  const getBorderColorClass = (color: string) => {
    switch (color) {
      case 'indigo': return 'hover:border-indigo-500/30';
      case 'teal': return 'hover:border-emerald-500/30';
      case 'amber': return 'hover:border-amber-500/30';
      case 'rose': return 'hover:border-rose-500/30';
      case 'orange': return 'hover:border-orange-500/30';
      case 'sky': return 'hover:border-sky-500/30';
      default: return 'hover:border-primary/30';
    }
  };

  // Helper to generate random appId for the builder route
  const getBuilderUrl = (slug: string) => {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `/builder/${randomId}?template=${slug}`;
  };

  return (
    <section className="w-full py-16 md:py-24 bg-bg-default border-b border-border-default transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Instant Bases</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading tracking-tight">
              Pre-built Operational Blueprints
            </h2>
            <p className="text-text-body font-medium mt-2 max-w-xl">
              Launch directly into fully structured layouts designed for specific organizational workflows.
            </p>
          </div>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-light transition-colors"
          >
            <span>Explore all templates</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scrollable Container */}
        <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-thin scrollbar-thumb-border-default scroll-smooth snap-x snap-mandatory">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className={`snap-start shrink-0 w-[320px] md:w-[360px] bg-bg-card border border-border-default rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 ${getBorderColorClass(tpl.color)}`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2.5 rounded-xl bg-bg-subtle text-text-heading">
                    {getIcon(tpl.icon)}
                  </div>
                  <div className="flex gap-2">
                    <Badge label={tpl.category} />
                    <Badge label={tpl.complexity} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-text-heading mb-2">{tpl.name}</h3>
                <p className="text-sm text-text-body font-medium line-clamp-3 mb-6 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 border-t border-border-subtle pt-4">
                <Link
                  href={getBuilderUrl(tpl.slug)}
                  className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Use Template</span>
                </Link>
                
                <Link
                  href={`/templates?template=${tpl.slug}`}
                  className="bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TemplatesShowcase;
