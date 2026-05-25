'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import ToastContainer from '../../components/shared/Toast';
import ErrorState from '../../components/shared/ErrorState';
import { useRouter } from 'next/navigation';
import { LayoutGrid, ArrowLeft, ExternalLink, Calendar, AppWindow, Play, Loader2 } from 'lucide-react';

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workspaces', {
        headers: { 'x-user-id': 'usr_seeded_developer' }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWorkspaces(data);
      setFetchError(null);
    } catch (err) {
      console.error(err);
      setFetchError('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  if (fetchError) {
    return (
      <>
        <Navbar />
        <main className="flex-grow bg-bg-default">
          <SectionWrapper className="pt-6 pb-28 text-center">
            <ErrorState 
              errorCode="FETCH_ERROR"
              message={fetchError}
              onRetry={() => {
                setFetchError(null);
                fetchWorkspaces();
              }}
            />
          </SectionWrapper>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative">
          <button 
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Marketplace</span>
          </button>

          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight flex items-center gap-2.5">
              <LayoutGrid className="w-6 h-6 text-primary" />
              <span>Developer Workspaces</span>
            </h1>
            <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
              Active sandbox containers, production deploys, and blueprint app templates
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs font-mono text-text-muted">Loading developer environments...</span>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="max-w-md mx-auto p-8 bg-bg-card border border-border-default rounded-3xl text-center shadow-md">
              <AppWindow className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-base font-extrabold text-text-heading mb-1">No workspaces active</h3>
              <p className="text-xs text-text-muted font-semibold mb-6">
                You haven&apos;t bootstrapped any workspace templates yet. Choose a template from the hub to get started.
              </p>
              <button
                onClick={() => router.push('/templates')}
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md"
              >
                Launch from Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((w: any) => (
                <div 
                  key={w.workspace_id} 
                  className="bg-bg-card border border-border-default hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center text-[10px] text-text-muted font-bold font-mono uppercase">
                      <span className="text-primary font-extrabold">SANDBOX CONTAINER</span>
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {w.status}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-text-heading leading-tight">{w.name}</h3>

                    <div className="space-y-1.5 pt-1 text-[11px] text-text-muted font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-muted" />
                        <span>Bootstrapped {new Date(w.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AppWindow className="w-3.5 h-3.5 text-text-muted" />
                        <span>App ID: {w.app_id || 'unassigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border-subtle my-5 w-full" />

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/workspaces/${w.workspace_id}`)}
                      className="flex-1 bg-bg-default border border-border-default hover:border-primary text-text-heading font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <span>Dashboard</span>
                    </button>
                    {w.deployment_url ? (
                      <a
                        href={w.deployment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-primary/10"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Launch App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="bg-bg-subtle border border-border-subtle text-text-muted font-bold text-xs px-4 py-2.5 rounded-xl opacity-60"
                      >
                        Not Deployed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <ToastContainer />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

export default function WorkspacesPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <WorkspacesPage />
    </PageErrorBoundary>
  );
}
