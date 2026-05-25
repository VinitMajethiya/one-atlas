'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { PageErrorBoundary } from '@/components/shared/PageErrorBoundary';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../components/nav/Navbar';
import Footer from '../../../components/shared/Footer';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import ToastContainer from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import { 
  ArrowLeft, AppWindow, Play, Terminal, Shield, Calendar, 
  ExternalLink, Activity, Info, RefreshCw, Undo, Loader2
} from 'lucide-react';

function WorkspaceDetailsContent() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rollingBack, setRollingBack] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      const res = await fetch(`/api/workspaces/${id}`, {
        headers: { 'x-user-id': 'usr_seeded_developer' }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        toast('Workspace not found', 'error');
        router.push('/workspaces');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to load workspace data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWorkspaceData();
    }
  }, [id]);

  const handleRollback = async () => {
    if (!data?.deployment?.id) return;
    setRollingBack(true);
    try {
      const res = await fetch(`/api/deployments/${data.deployment.id}/rollback`, {
        method: 'POST',
        headers: { 'x-user-id': 'usr_seeded_developer' }
      });
      if (res.ok) {
        const json = await res.json();
        toast('Rollback initiated successfully!', 'success');
        // Poll for updates
        setTimeout(() => {
          fetchWorkspaceData();
          setRollingBack(false);
        }, 3000);
      } else {
        const json = await res.json();
        toast(json.error?.message || 'Rollback failed', 'error');
        setRollingBack(false);
      }
    } catch {
      toast('Error triggering rollback', 'error');
      setRollingBack(false);
    }
  };

  if (loading) {
    return (
      <SectionWrapper className="bg-bg-default py-20 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-mono text-text-muted">Accessing container partition...</span>
        </div>
      </SectionWrapper>
    );
  }

  if (!data) return null;

  const { workspace, deployment, app } = data;
  const isDeployed = deployment && deployment.status === 'success';

  return (
    <SectionWrapper className="bg-bg-default pt-6 pb-28 text-left relative">
      {/* Return link */}
      <button 
        onClick={() => router.push('/workspaces')}
        className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Workspaces</span>
      </button>

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-widest block mb-1">
            Sandbox Control Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight">
            {workspace.name}
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Running container partition linked to {app?.name || 'Blueprint App'} (v{app?.current_version || '1.0.0'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDeployed && deployment.url && (
            <a
              href={deployment.url}
              className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
            >
              Open App
            </a>
          )}
          <button 
            onClick={fetchWorkspaceData}
            className="p-3 bg-bg-card border border-border-default hover:border-primary text-text-muted hover:text-text-heading rounded-xl transition-all"
            title="Sync Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Live Sandbox View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border-default bg-bg-card rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center bg-bg-subtle/30">
              <div className="flex items-center gap-2">
                <AppWindow className="w-4.5 h-4.5 text-primary" />
                <span className="text-xs font-bold text-text-heading">App Sandbox Shell Preview</span>
              </div>
              {isDeployed && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold font-mono text-emerald-500 uppercase">Live Sandbox Active</span>
                </div>
              )}
            </div>

            {/* Sandbox iframe or screenshot container */}
            <div className="aspect-video bg-bg-subtle flex items-center justify-center p-1 relative min-h-[320px]">
              {isDeployed && deployment.url ? (
                <iframe 
                  src={deployment.url} 
                  className="w-full h-full border-0 rounded-2xl bg-white overflow-hidden shadow-inner" 
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent-pink/15 text-accent-pink flex items-center justify-center mx-auto animate-pulse">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-text-heading">Sandbox Deactivated</h4>
                  <p className="text-xs text-text-muted max-w-sm mx-auto font-semibold">
                    The docker image deploy pipeline is currently pending or has issues. Run a deployment trigger to reactivate.
                  </p>
                </div>
              )}
            </div>

            {/* Live URL footer */}
            {isDeployed && deployment.url && (
              <div className="px-5 py-3 border-t border-border-subtle bg-bg-subtle/10 flex justify-between items-center text-xs font-mono font-bold text-text-muted">
                <span>SANDBOX LOCATION</span>
                <a 
                  href={deployment.url} 
                  target="_blank" 
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {deployment.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Terminal log panel */}
          {deployment && (
            <div className="border border-border-default bg-black/95 text-zinc-300 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <div className="px-5 py-3.5 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Deployment stdout terminal</span>
                </div>
                <span className="text-[10px] font-bold font-mono text-zinc-500">ID: {deployment.id}</span>
              </div>
              <pre className="p-5 font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto text-left scrollbar-thin whitespace-pre-wrap select-text">
                {deployment.build_log?.length 
                  ? deployment.build_log.map((log: string, idx: number) => `[${idx + 1}] ${log}`).join('\n')
                  : 'No build logs available.'}
              </pre>
            </div>
          )}
        </div>

        {/* Right column: metadata cards */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="border border-border-default bg-bg-card rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-text-heading flex items-center gap-2 border-b border-border-subtle pb-3">
              <Activity className="w-4 h-4 text-primary" />
              <span>Container Status</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-muted">Partition State</span>
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                  {workspace.status}
                </span>
              </div>

              {deployment && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-text-muted">Latest Deploy Pipeline</span>
                  <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                    deployment.status === 'success' ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' : 'bg-accent-pink/15 text-accent-pink border-accent-pink/20'
                  }`}>
                    {deployment.status}
                  </span>
                </div>
              )}

              {deployment && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-text-muted">Environment Label</span>
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-violet-500/15 text-violet-500 border border-violet-500/20">
                    {deployment.env || 'production'}
                  </span>
                </div>
              )}

              {deployment && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-text-muted">Last Deploy Time</span>
                  <span className="font-mono font-bold text-text-heading">
                    {new Date(deployment.created_at).toLocaleDateString()} {new Date(deployment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            {/* Rollback button */}
            {deployment && deployment.rollback_deployment_id && (
              <button
                onClick={handleRollback}
                disabled={rollingBack}
                className="w-full bg-bg-default border border-border-default hover:border-primary disabled:opacity-50 text-text-heading font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                {rollingBack ? (
                  <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
                ) : (
                  <Undo className="w-4 h-4 text-text-muted" />
                )}
                <span>Rollback to Version {deployment.rollback_deployment_id.slice(-6)}</span>
              </button>
            )}
          </div>

          {/* Metadata list */}
          <div className="border border-border-default bg-bg-card rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-text-heading flex items-center gap-2 border-b border-border-subtle pb-3">
              <Info className="w-4 h-4 text-primary" />
              <span>Workspace Info</span>
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider block">Workspace Name</span>
                <span className="text-text-heading block bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle font-mono">
                  {workspace.name}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider block">Workspace UUID</span>
                <span className="font-mono text-text-heading text-[11px] select-all bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle block truncate">
                  {workspace.id}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider block">Owner (User ID)</span>
                <span className="font-mono text-text-heading text-[11px] block bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle">
                  {workspace.owner || 'N/A'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider block">Organization Reference</span>
                <span className="font-mono text-text-heading text-[11px] block bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle">
                  {workspace.org_id || 'Global Tenant Space'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider block">Container Provision Date</span>
                <span className="text-text-heading flex items-center gap-1.5 bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <span>{new Date(workspace.created_at || workspace.created_at).toLocaleString()}</span>
                </span>
              </div>

              {workspace.permissions && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider block">Role privileges</span>
                  <div className="flex flex-wrap gap-1.5">
                    {typeof workspace.permissions === 'object' && workspace.permissions !== null
                      ? Object.entries(workspace.permissions).map(([key, val], idx) => (
                          <span key={idx} className="bg-bg-subtle border border-border-subtle px-2 py-0.5 rounded text-[10px] font-mono text-text-muted">
                            {key}: {String(val)}
                          </span>
                        ))
                      : <span className="bg-bg-subtle border border-border-subtle px-2 py-0.5 rounded text-[10px] font-mono text-text-muted">None</span>
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </SectionWrapper>
  );
}

function WorkspaceDetailsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <SectionWrapper className="bg-bg-default pt-10 pb-24 text-center">
            <div className="text-text-muted font-bold py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-mono">Loading workspace details...</span>
            </div>
          </SectionWrapper>
        }>
          <WorkspaceDetailsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function WorkspaceDetailsPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <WorkspaceDetailsPage />
    </PageErrorBoundary>
  );
}
