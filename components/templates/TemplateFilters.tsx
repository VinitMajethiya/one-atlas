'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { TemplateCategory, Complexity } from '../../types/template';

interface TemplateFiltersProps {
  category: string | null;
  complexity: string | null;
  onFilterChange: (key: string, value: string | null) => void;
}

export function TemplateFilters({ category, complexity, onFilterChange }: TemplateFiltersProps) {
  const categories: TemplateCategory[] = ['CRM', 'HR', 'Admin', 'Analytics', 'Inventory', 'Support'];
  const complexities: Complexity[] = ['Simple', 'Moderate', 'Advanced'];

  const handleReset = () => {
    onFilterChange('category', null);
    onFilterChange('complexity', null);
  };

  return (
    <div className="bg-bg-card border border-border-default rounded-2xl p-6 text-left shadow-sm space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 text-text-heading font-bold text-sm">
          <Filter className="h-4.5 w-4.5 text-primary" />
          <span>Filter Templates</span>
        </div>
        {(category || complexity) && (
          <button
            onClick={handleReset}
            className="text-[10px] font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category filters */}
      <div>
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">By Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('category', null)}
            className={`w-full text-left px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors ${
              category === null
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                : 'text-text-body hover:bg-bg-subtle'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange('category', cat.toLowerCase())}
              className={`w-full text-left px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors ${
                category === cat.toLowerCase()
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                  : 'text-text-body hover:bg-bg-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Complexity filters */}
      <div>
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">By Complexity</h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('complexity', null)}
            className={`w-full text-left px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors ${
              complexity === null
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                : 'text-text-body hover:bg-bg-subtle'
            }`}
          >
            All Complexities
          </button>
          {complexities.map((comp) => (
            <button
              key={comp}
              onClick={() => onFilterChange('complexity', comp.toLowerCase())}
              className={`w-full text-left px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors ${
                complexity === comp.toLowerCase()
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                  : 'text-text-body hover:bg-bg-subtle'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateFilters;
