'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePreviewStore } from '../../../store/usePreviewStore';
import CanvasPanel from '../../../components/builder/CanvasPanel';
import { Compass, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';

export default function PreviewPage() {
  const params = useParams();
  const token = params?.token as string;
  
  const snapshots = usePreviewStore((state) => state.snapshots);

  // Next.js Hydration Guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg-default text-text-muted">
        <div className="text-xs font-bold font-mono">Hydrating preview snapshot...</div>
      </div>
    );
  }

  // Look up snapshot
  const snapshot = token ? snapshots[token] : null;

  // Render 404 state if token is unknown
  if (!snapshot) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg-default grid-mesh px-6 text-center select-none">
        <div className="max-w-md w-full bg-bg-card border border-border-default rounded-3xl p-8 shadow-xl">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100 dark:border-rose-900/50">
            <AlertTriangle className="h-6 w-6" />
          </div>
          
          <h1 className="text-xl md:text-2xl font-extrabold text-text-heading mb-3 tracking-tight">
            Preview Not Found
          </h1>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed font-semibold mb-8">
            The preview link token is invalid, expired, or was created in another browser session.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/templates"
              className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-4 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Blueprints</span>
            </Link>
            <Link
              href="/"
              className="bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default font-bold text-xs px-4 py-3 rounded-xl transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-default text-left select-none">
      
      {/* Non-dismissable Preview Banner */}
      <div className="bg-primary text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm shrink-0">
        <Eye className="h-4 w-4 shrink-0" />
        <span>This is a preview &mdash; changes to the live app won&apos;t affect this snapshot</span>
      </div>

      {/* Preview Header Navbar */}
      <header className="h-14 border-b border-border-default bg-bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/templates" className="flex items-center gap-1.5 text-text-heading hover:text-primary transition-colors">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-bold text-xs tracking-wider uppercase">Atlas Preview</span>
          </Link>
          <span className="text-border-default font-thin">|</span>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-extrabold text-text-heading">
              {snapshot.schema.appName}
            </h2>
            <span className="bg-bg-subtle border border-border-subtle text-text-muted font-bold text-[10px] px-1.5 py-0.5 rounded-full">
              Snapshot v{snapshot.schema.version}
            </span>
          </div>
        </div>

        <Link
          href="/templates"
          className="bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default font-bold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Preview</span>
        </Link>
      </header>

      {/* Main Canvas view in Read-Only Mode */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <CanvasPanel readOnly={true} previewSchema={snapshot.schema} />
      </main>

      {/* Status Bar */}
      <footer className="h-8 border-t border-border-default bg-bg-card flex items-center justify-between px-4 text-[11px] font-bold text-text-muted">
        <div>
          <span>Created: {new Date(snapshot.createdAt).toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-blue" />
          <span>Frozen State</span>
        </div>
      </footer>

    </div>
  );
}
