'use client';

import React from 'react';
import { useToastStore } from '../../hooks/useToast';
import { X, CheckCircle, AlertOctagon, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let typeColor = 'bg-bg-card border-border-default text-text-heading';
        let icon = <Info className="w-5 h-5 text-accent-blue" />;

        if (toast.type === 'success') {
          typeColor = 'bg-bg-card border-accent-blue/30 text-text-heading';
          icon = <CheckCircle className="w-5 h-5 text-accent-blue" />;
        } else if (toast.type === 'error') {
          typeColor = 'bg-bg-card border-accent-pink/30 text-text-heading';
          icon = <AlertOctagon className="w-5 h-5 text-accent-pink" />;
        } else if (toast.type === 'warning') {
          typeColor = 'bg-bg-card border-amber-500/30 text-text-heading';
          icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 border rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-auto animate-slide-in ${typeColor}`}
          >
            <div className="shrink-0 pt-0.5">{icon}</div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs md:text-sm font-extrabold leading-none">{toast.message}</h4>
              {toast.description && (
                <p className="text-[11px] text-text-muted font-semibold leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-heading transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
