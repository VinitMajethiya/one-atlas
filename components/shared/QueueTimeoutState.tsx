'use client';

import React from 'react';
import { Timer, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface QueueTimeoutStateProps {
  jobType?: 'clone' | 'deployment' | string;
  jobId?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function QueueTimeoutState({ jobType = 'deployment', jobId, onRetry, onCancel }: QueueTimeoutStateProps) {
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-bg-card border border-border-default rounded-3xl shadow-standard flex flex-col items-center text-center">
      <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 mb-4 animate-pulse">
        <Timer className="w-8 h-8" />
      </div>

      <span className="text-[10px] font-bold font-mono tracking-widest text-amber-500 uppercase bg-amber-500/10 px-2.5 py-1 rounded-md mb-2">
        TIMEOUT EXCEEDED
      </span>

      <h3 className="text-lg font-extrabold text-text-heading mb-2">
        Request is taking longer than expected
      </h3>
      <p className="text-xs text-text-muted font-semibold leading-relaxed mb-6">
        The background {jobType} process (ID: <code className="font-mono text-primary">{jobId || 'unknown'}</code>) has run for more than 30 seconds. This might be due to server load or network congestion.
      </p>

      <div className="w-full bg-amber-500/5 rounded-2xl p-4 border border-amber-500/20 mb-6 flex gap-3 text-left">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-bold text-text-heading font-mono uppercase tracking-wider mb-1">
            Status check
          </h4>
          <p className="text-[10px] text-text-muted font-semibold leading-snug">
            Your task is still queued and executing on our runners. You can continue waiting, retry the socket request, or cancel the task entirely.
          </p>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-bg-default border border-border-default hover:border-accent-pink/30 hover:text-accent-pink text-text-heading font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Task</span>
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-standard shadow-primary/10 hover:scale-[1.01] active:scale-[0.99]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default QueueTimeoutState;
