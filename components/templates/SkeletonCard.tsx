import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-5 space-y-4 shadow-sm animate-pulse relative overflow-hidden select-none">
      {/* Shimmer animation overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ animationDuration: '1.5s' }} />

      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-bg-subtle border border-border-subtle rounded-2xl animate-pulse" />
        <div className="w-16 h-5 bg-bg-subtle border border-border-subtle rounded-full" />
      </div>

      <div className="space-y-2">
        <div className="h-5 w-2/3 bg-bg-subtle rounded-lg" />
        <div className="h-3 w-full bg-bg-subtle rounded-lg" />
        <div className="h-3 w-5/6 bg-bg-subtle rounded-lg" />
      </div>

      <div className="h-px bg-border-subtle w-full" />

      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-2">
          <div className="w-12 h-4 bg-bg-subtle rounded-md" />
          <div className="w-10 h-4 bg-bg-subtle rounded-md" />
        </div>
        <div className="w-14 h-4 bg-bg-subtle rounded-md" />
      </div>
    </div>
  );
}
