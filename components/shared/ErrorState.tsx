'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Activity, ChevronRight } from 'lucide-react';

interface ErrorStateProps {
  errorCode?: string | null;
  message?: string | null;
  onRetry?: () => void;
}

export function ErrorState({ errorCode = 'GENERIC_ERROR', message = 'An unexpected error occurred.', onRetry }: ErrorStateProps) {
  const [dbStatus, setDbStatus] = useState<string>('checking...');
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(true);

  // Diagnostics check on mount
  useEffect(() => {
    // Fire telemetry event: error_view
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'error_view',
        user_id: 'usr_seeded_developer',
        metadata: { error_code: errorCode, error_message: message }
      })
    }).catch(console.error);

    async function checkDiagnostics() {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setDbStatus(data.status === 'healthy' ? 'Database Operational' : 'Database Issues Detected');
        } else {
          setDbStatus('Diagnostics check failed');
        }
      } catch {
        setDbStatus('Offline/No Connection');
      } finally {
        setLoadingDiagnostics(false);
      }
    }
    checkDiagnostics();
  }, [errorCode, message]);

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-bg-card border border-accent-pink/20 hover:border-accent-pink/30 rounded-3xl shadow-xl flex flex-col items-center text-center transition-all duration-300">
      <div className="p-4 bg-accent-pink/10 rounded-2xl text-accent-pink mb-4 animate-bounce">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-[10px] font-bold font-mono tracking-widest text-accent-pink uppercase bg-accent-pink/10 px-2.5 py-1 rounded-md mb-2">
        ERROR {errorCode || 'UNKNOWN'}
      </span>

      <h3 className="text-lg font-extrabold text-text-heading mb-2">
        Something went wrong
      </h3>
      <p className="text-xs text-text-muted font-semibold leading-relaxed mb-6">
        {message}
      </p>

      {/* Diagnostics details */}
      <div className="w-full bg-bg-subtle/50 rounded-2xl p-4 border border-border-subtle mb-6 text-left">
        <h4 className="text-[11px] font-bold text-text-heading font-mono uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Diagnostics Report
        </h4>
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-text-muted">Database Status</span>
          <span className={`font-bold ${dbStatus.includes('Operational') ? 'text-emerald-500' : 'text-accent-pink'}`}>
            {loadingDiagnostics ? 'loading...' : dbStatus}
          </span>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full bg-bg-default border border-border-default hover:border-primary text-text-heading font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm group"
        >
          <RefreshCw className="w-4 h-4 text-text-muted group-hover:rotate-180 transition-transform duration-500" />
          <span>Retry Action</span>
          <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
        </button>
      )}
    </div>
  );
}

export default ErrorState;
