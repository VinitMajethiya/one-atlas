'use client';

import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

export function BottomBar() {
  const { schema } = useBuilderStore();

  if (!schema) return null;

  return (
    <footer className="h-8 border-t border-border-default bg-bg-card flex items-center justify-between px-4 text-[11px] font-bold text-text-muted select-none">
      <div className="flex items-center gap-1.5">
        <span>Schema Engine:</span>
        <span className="text-text-heading font-extrabold uppercase">v{schema.version}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span>Updated: Just now</span>
        <span className="text-border-default">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-text-heading">Connected</span>
        </div>
      </div>
    </footer>
  );
}

export default BottomBar;
