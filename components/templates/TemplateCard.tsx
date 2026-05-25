'use client';

import React from 'react';
import { Briefcase, Users, Sliders, BarChart2, Package, HelpCircle, Eye } from 'lucide-react';
import { Template } from '../../types/template';
import { Badge } from '../shared/Badge';
import { useTemplateStore } from '../../store/useTemplateStore';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const openTemplateDetails = useTemplateStore((state) => state.openTemplateDetails);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="h-5 w-5 text-indigo-500" />;
      case 'Users': return <Users className="h-5 w-5 text-emerald-500" />;
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

  // Helper to generate deterministic but random-looking appId for the builder route
  const getBuilderUrl = (slug: string) => {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = (hash << 5) - hash + slug.charCodeAt(i);
      hash |= 0;
    }
    const cleanHash = Math.abs(hash).toString(36).toUpperCase().substring(0, 8);
    return `/builder/${cleanHash}?template=${slug}`;
  };

  return (
    <div
      onClick={() => openTemplateDetails(template)}
      className={`group bg-bg-card border border-border-default rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${getBorderColorClass(template.color)}`}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="p-2.5 rounded-xl bg-bg-subtle text-text-heading">
            {getIcon(template.icon)}
          </div>
          <div className="flex gap-2">
            <Badge label={template.category} />
            <Badge label={template.complexity} />
          </div>
        </div>

        <h3 className="text-lg font-bold text-text-heading mb-2 group-hover:text-primary transition-colors">{template.name}</h3>
        <p className="text-xs md:text-sm text-text-body font-semibold line-clamp-3 mb-6 leading-relaxed">
          {template.description}
        </p>
      </div>

      <div 
        className="grid grid-cols-2 gap-3 mt-4 border-t border-border-subtle pt-4"
        onClick={(e) => e.stopPropagation()} // Stop modal from opening on button click
      >
        <a
          href={getBuilderUrl(template.slug)}
          className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center"
        >
          Use Template
        </a>
        
        <button
          onClick={() => openTemplateDetails(template)}
          className="bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
}

export default TemplateCard;
