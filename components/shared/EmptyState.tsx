import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, actionText, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-default bg-bg-card rounded-3xl max-w-lg mx-auto space-y-5">
      <div className="w-12 h-12 bg-bg-subtle text-text-muted rounded-2xl flex items-center justify-center border border-border-subtle">
        {icon || <HelpCircle className="h-6 w-6" />}
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-sm font-extrabold text-text-heading">{title}</h3>
        <p className="text-xs text-text-muted leading-relaxed font-medium">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
