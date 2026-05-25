'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowUpRight, X, Sparkles } from 'lucide-react';

interface PlanRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan?: 'pro' | 'enterprise' | string;
}

export function PlanRestrictionModal({ isOpen, onClose, requiredPlan = 'pro' }: PlanRestrictionModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire plan_gate_shown event
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'plan_gate_shown',
          user_id: 'usr_seeded_developer',
          metadata: { required_plan: requiredPlan }
        })
      }).catch(console.error);
    }
  }, [isOpen, requiredPlan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-bg-card border border-border-default rounded-3xl shadow-2xl overflow-hidden p-6 text-center animate-slide-in">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-bg-subtle/50 hover:bg-bg-subtle border border-border-subtle text-text-muted hover:text-text-heading transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-4 animate-pulse">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-text-heading mb-2">
          Upgrade Plan Required
        </h3>
        <p className="text-xs text-text-muted font-semibold leading-relaxed mb-6">
          This blueprint or action is only available to teams on the <strong className="text-primary uppercase font-mono">{requiredPlan}</strong> tier. Unlock advanced custom integrations, AI-based schema mutations, and live docker deployments.
        </p>

        {/* Pricing Tiers Highlight */}
        <div className="bg-bg-subtle/40 border border-border-subtle rounded-2xl p-4 mb-6 text-left space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold font-mono text-text-muted uppercase">
            <span>Features Included in {requiredPlan}</span>
            <span className="text-primary font-extrabold">Instant Access</span>
          </div>
          <ul className="text-xs text-text-heading font-semibold space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Full-Stack AI Code Customizations</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Live Deployment Rollover & Rollbacks</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Immutable Organizational Audit Logs</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-bg-subtle hover:bg-bg-subtle/80 border border-border-default text-text-heading font-bold text-xs py-3 rounded-xl transition-all"
          >
            Cancel
          </button>
          <Link
            href="/pricing"
            onClick={onClose}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlock Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlanRestrictionModal;
