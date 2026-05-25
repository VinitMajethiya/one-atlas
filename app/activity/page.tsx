'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import EmptyState from '../../components/shared/EmptyState';
import ToastContainer from '../../components/shared/Toast';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Calendar, User, Database, ArrowRight, Loader2 } from 'lucide-react';

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function ActivityPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchActivity() {
      setLoading(true);
      try {
        const res = await fetch(`/api/activity-log?page=${page}&limit=10&user_id=usr_seeded_developer`);
        if (res.ok) {
          const json = await res.json();
          setLogs(json.data || []);
          setTotalPages(json.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [page]);

  const getBadgeColor = (action: string) => {
    if (action.includes('error')) return 'bg-accent-pink/15 text-accent-pink border-accent-pink/20';
    if (action.includes('success')) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
    if (action.includes('deploy') || action.includes('clone')) return 'bg-accent-blue/15 text-accent-blue border-accent-blue/20';
    return 'bg-bg-subtle border-border-subtle text-text-muted';
  };

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
              <Activity className="w-6 h-6 text-primary" />
              <span>Platform Activity Log</span>
            </h1>
            <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
              Immutable user-facing audit trail of marketplace and deploy events
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs font-mono text-text-muted">Retrieving audit trail...</span>
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              title="No activity yet."
              description="Start by cloning a template."
              icon={<Activity className="w-6 h-6" />}
              actionText="Browse Templates"
              onAction={() => router.push('/templates')}
            />
          ) : (
            <div className="space-y-4">
              <div className="border border-border-default rounded-3xl bg-bg-card shadow-sm overflow-hidden divide-y divide-border-subtle">
                {logs.map((log: any) => (
                  <div key={log.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-bg-subtle/25 transition-all">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-bold uppercase tracking-wider ${getBadgeColor(log.action)}`}>
                          {log.action.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-heading">
                        Action performed by developer session.
                        {log.template?.name && (
                          <span> Blueprint: <strong className="text-primary">{log.template.name}</strong></span>
                        )}
                        {log.workspace?.name && (
                          <span> Workspace: <strong className="text-primary">{log.workspace.name}</strong></span>
                        )}
                      </p>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <pre className="text-[10px] font-mono bg-bg-subtle p-2.5 rounded-xl border border-border-subtle max-w-full overflow-x-auto text-text-muted max-h-24 overflow-y-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-4 py-2 bg-bg-card border border-border-default hover:border-primary disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold font-mono transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-mono font-bold text-text-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="px-4 py-2 bg-bg-card border border-border-default hover:border-primary disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold font-mono transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          <ToastContainer />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

export default function ActivityPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <ActivityPage />
    </PageErrorBoundary>
  );
}
