'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import TemplateFilters from '../../components/templates/TemplateFilters';
import TemplateCard from '../../components/templates/TemplateCard';
import TemplateModal from '../../components/templates/TemplateModal';
import { TEMPLATES } from '../../data/templates';

function TemplatesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL search params
  const activeCategory = searchParams.get('category');
  const activeComplexity = searchParams.get('complexity');

  // Filter templates list
  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (activeCategory && tpl.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (activeComplexity && tpl.complexity.toLowerCase() !== activeComplexity.toLowerCase()) {
      return false;
    }
    return true;
  });

  // URL State Syncer
  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <SectionWrapper className="bg-bg-default pt-10 pb-24">
      <div className="text-left mb-12 border-b border-border-subtle pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">Application Hub</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-text-heading tracking-tight leading-none">
          Operational Blueprints
        </h1>
        <p className="text-sm md:text-base text-text-body font-semibold mt-3 max-w-xl leading-relaxed">
          Pick a template to bootstrap your database layout. Refine fields, visibility keys, and chart blocks dynamically on the canvas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <TemplateFilters
            category={activeCategory}
            complexity={activeComplexity}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right Cards Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 text-text-muted font-bold text-sm bg-bg-card border border-border-default rounded-2xl">
              No blueprints match your filter criteria. Try resetting filters.
            </div>
          )}
        </div>
      </div>

      {/* Slide-over details drawer */}
      <TemplateModal />
    </SectionWrapper>
  );
}

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <SectionWrapper className="bg-bg-default pt-10 pb-24 text-center">
            <div className="text-text-muted font-bold py-12">Loading templates database...</div>
          </SectionWrapper>
        }>
          <TemplatesContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
