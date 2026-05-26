'use client';

import React, { useState } from 'react';
import { 
  Briefcase, Users, Sliders, BarChart2, Package, HelpCircle, Eye, 
  Heart, Star, StarHalf, ShieldCheck, CheckSquare, Square, Play 
} from 'lucide-react';
import { Template } from '../../types/template';
import { Badge } from '../shared/Badge';
import { useTemplateStore } from '../../store/useTemplateStore';
import { useToast } from '../../hooks/useToast';
import { templateBorderHover, templateIconClass } from '@/lib/theme';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const openTemplateDetails = useTemplateStore((state) => state.openTemplateDetails);
  const { toast } = useToast();

  const [isSaved, setIsSaved] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [saveCount, setSaveCount] = useState(template.cloneCount);

  // Read compare states from Zustand if available (fall back to local state)
  const compareList = useTemplateStore((state: any) => state.compareList || []);
  const toggleCompare = useTemplateStore((state: any) => state.toggleCompare);
  
  const activeCompared = toggleCompare ? compareList.includes(template.id) : isCompared;

  const getIcon = (iconName: string) => {
    const cls = templateIconClass(iconName);
    switch (iconName) {
      case 'Briefcase': return <Briefcase className={`h-5 w-5 ${cls}`} />;
      case 'Users': return <Users className={`h-5 w-5 ${cls}`} />;
      case 'Sliders': return <Sliders className={`h-5 w-5 ${cls}`} />;
      case 'BarChart2': return <BarChart2 className={`h-5 w-5 ${cls}`} />;
      case 'Package': return <Package className={`h-5 w-5 ${cls}`} />;
      case 'HelpCircle': return <HelpCircle className={`h-5 w-5 ${cls}`} />;
      default: return <Briefcase className={`h-5 w-5 ${cls}`} />;
    }
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    
    // Call favorite API
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_seeded_developer' },
        body: JSON.stringify({ template_id: template.id })
      });
      if (res.ok) {
        toast(nextSaved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'success');
        // Push favorite_template event
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'favorite_template',
            user_id: 'usr_seeded_developer',
            metadata: { template_id: template.id, is_favorite: nextSaved }
          })
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleCompare) {
      toggleCompare(template.id);
    } else {
      setIsCompared(!isCompared);
    }
    const isAdding = !activeCompared;
    toast(isAdding ? 'Added to comparison' : 'Removed from comparison', 'info');
    
    // Telemetry: filter_apply with compare info
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'filter_apply',
          user_id: 'usr_seeded_developer',
          metadata: { filter_type: 'compare', template_id: template.id, is_compare: isAdding }
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === floor + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-border-default" />);
      }
    }
    return stars;
  };

  const handleCardClick = async () => {
    openTemplateDetails(template);
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'template_open',
          user_id: 'usr_seeded_developer',
          metadata: { template_id: template.id }
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardHover = async () => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'template_hover',
          user_id: 'usr_seeded_developer',
          metadata: { template_id: template.id }
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      className={`group relative bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden flex flex-col justify-between shadow-standard hover:-translate-y-1 transition-standard cursor-pointer select-none ${templateBorderHover(template.color)}`}
    >
      {/* Top Graphic Panel */}
      <div className="relative h-40 w-full bg-[#F5F5EE] overflow-hidden border-b border-border-default shrink-0">
        {template.screenshots && template.screenshots[0] ? (
          <img 
            src={template.screenshots[0]} 
            alt={template.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F5EE] flex items-center justify-center">
            {getIcon(template.icon)}
          </div>
        )}

        {/* Floating Price Badge */}
        <div className="absolute top-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded-lg text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
          {template.priceType === 'free' ? 'Free' : `₹${Math.round(template.priceAmount * 80).toLocaleString('en-IN')}/mo`}
        </div>

        {/* Favorite Save Button */}
        <button
          onClick={handleSaveToggle}
          className={`absolute top-3 right-3 p-2 rounded-xl border shadow-sm transition-standard ${
            isSaved 
              ? 'bg-[#FFF0E6] border-[#FFD6B3] text-primary' 
              : 'bg-black/60 border-white/10 text-white/70 hover:text-white hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Compare Checkbox */}
        <button
          onClick={handleCompareClick}
          className="absolute bottom-3 left-3 p-2 rounded-lg bg-black/60 border border-white/10 text-white/70 hover:text-white flex items-center gap-1 shadow-sm transition-standard"
        >
          {activeCompared ? (
            <CheckSquare className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
          <span className="text-[9px] font-bold font-mono">COMPARE</span>
        </button>

        {/* Health Score Overlay Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <span className="text-[9px] text-white/60 font-bold font-mono">HEALTH</span>
          <span className={`text-[10px] font-extrabold font-mono ${
            template.healthScore >= 95 ? 'text-primary' : template.healthScore >= 90 ? 'text-amber-400' : 'text-text-muted'
          }`}>
            {template.healthScore}%
          </span>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="p-[28px] flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Header row metadata */}
          <div className="flex justify-between items-center text-[10px] text-text-muted font-bold font-mono uppercase tracking-wider">
            <div className="flex items-center gap-1">
              {getIcon(template.icon)}
              <span className="text-text-heading">{template.category}</span>
            </div>
            <Badge label={template.complexity} />
          </div>

          <div>
            <h3 className="text-[22px] font-semibold text-text-heading group-hover:text-primary transition-colors leading-tight mb-1">
              {template.name}
            </h3>
            <p className="text-xs text-text-muted font-semibold leading-relaxed line-clamp-2">
              {template.subtitle || template.description}
            </p>
          </div>

          {/* Tech Stack Pills (Limit to top 3) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {template.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="bg-bg-subtle border border-border-default text-text-muted font-bold text-[10px] px-2 py-0.5 rounded-md uppercase font-mono tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Middle Divider */}
        <div className="h-px bg-border-default my-4 w-full" />

        {/* Rating and Clone Count Stats */}
        <div className="flex justify-between items-center text-xs font-semibold text-text-muted mb-2">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-text-heading font-mono text-[11px]">{template.rating}</span>
            <div className="flex items-center">{renderStars(template.rating)}</div>
          </div>
          <span className="font-mono text-[11px] font-bold">
            {(saveCount / 1000).toFixed(1)}k clones
          </span>
        </div>

        {/* Author badge footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-white font-mono uppercase shadow-sm">
              {template.author.slice(0, 2)}
            </div>
            <span className="text-[10px] text-text-heading font-extrabold leading-none">
              {template.author}
            </span>
            {template.authorVerified && (
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
