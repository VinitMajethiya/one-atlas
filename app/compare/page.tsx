'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import EmptyState from '../../components/shared/EmptyState';
import ToastContainer from '../../components/shared/Toast';
import CloneFlowModal from '../../components/templates/CloneFlowModal';
import { useCloneFlowStore } from '../../store/useCloneFlowStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { 
  ArrowLeft, Check, X, ShieldAlert, Sparkles, Scale, Activity,
  Database, Cable, GitFork, ArrowRight, Loader2
} from 'lucide-react';

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsString = searchParams.get('ids') || '';

  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal and template selection state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');
  const [isCloneFlowOpen, setIsCloneFlowOpen] = useState(false);

  // Clone machine triggers
  const advanceStep = useCloneFlowStore((state) => state.advanceStep);
  const setCloneId = useCloneFlowStore((state) => state.setCloneId);
  const resetFlow = useCloneFlowStore((state) => state.resetFlow);

  useEffect(() => {
    async function fetchCompare() {
      if (!idsString) {
        setTemplates([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/compare-view?ids=${idsString}`);
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompare();
  }, [idsString]);

  const handleUseTemplate = async (templateId: string, templateName: string) => {
    setSelectedTemplateId(templateId);
    setSelectedTemplateName(templateName);
    setIsCloneFlowOpen(true);
    // Triggers clone machine step 4: cta_click
    advanceStep('cta_click');
    try {
      // POST to clone
      const res = await fetch(`/api/templates/${templateId}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId, workspace_id: 'default' })
      });
      if (res.ok) {
        const data = await res.json();
        setCloneId(data.clone_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <SectionWrapper className="bg-bg-default py-20 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-mono text-text-muted">Resolving operational comparisons...</span>
        </div>
      </SectionWrapper>
    );
  }

  if (templates.length === 0) {
    return (
      <SectionWrapper className="bg-bg-default py-20 text-center">
        <EmptyState
          title="Select 2–3 templates from the marketplace to compare."
          description="Go back to the marketplace page and select at least two blueprints to compare side-by-side."
          actionText="Browse Marketplace"
          onAction={() => router.push('/templates')}
          icon={<Scale className="w-6 h-6" />}
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="bg-bg-default pt-6 pb-28 text-left relative">
      <button 
        onClick={() => router.push('/templates')}
        className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Marketplace</span>
      </button>

      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          <span>Blueprint Comparison Matrix</span>
        </h1>
        <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
          Comparing {templates.length} Operational Blueprints side-by-side
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border-default bg-bg-card shadow-standard">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-default bg-bg-subtle/50">
              <th className="p-5 text-xs font-bold font-mono text-text-muted uppercase tracking-wider w-1/4">Specification</th>
              {templates.map(tpl => (
                <th key={tpl.id} className="p-5 text-left w-1/4 min-w-[240px] border-l border-border-default">
                  <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-wider mb-1 block">
                    {tpl.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-text-heading leading-tight">{tpl.name}</h3>
                  <p className="text-[11px] text-text-muted font-semibold line-clamp-2 mt-1 leading-snug">
                    {tpl.subtitle || tpl.description}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-xs">
            {/* Health Score */}
            <tr>
              <td className="p-5 font-bold text-text-muted flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary" />
                <span>Health Score</span>
              </td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default font-mono font-bold">
                  <span className={`px-2 py-1 rounded text-[11px] ${
                    tpl.healthScore >= 95 ? 'bg-accent-blue/15 text-accent-blue' : tpl.healthScore >= 90 ? 'bg-amber-500/15 text-amber-500' : 'bg-accent-pink/15 text-accent-pink'
                  }`}>
                    {tpl.healthScore}%
                  </span>
                </td>
              ))}
            </tr>

            {/* Complexity */}
            <tr>
              <td className="p-5 font-bold text-text-muted flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-primary" />
                <span>Complexity</span>
              </td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default font-mono uppercase font-bold text-text-heading">
                  {tpl.complexity}
                </td>
              ))}
            </tr>

            {/* Pricing */}
            <tr>
              <td className="p-5 font-bold text-text-muted flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Pricing Category</span>
              </td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  <span className="font-bold text-text-heading font-mono uppercase block">
                    {tpl.priceType}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono block mt-0.5">
                    {tpl.priceType === 'free' ? 'No cost' : `₹${Math.round(tpl.priceAmount * 80).toLocaleString('en-IN')}/mo`}
                  </span>
                </td>
              ))}
            </tr>

            {/* Tech Stack */}
            <tr>
              <td className="p-5 font-bold text-text-muted flex items-center gap-1.5">
                <Database className="w-4 h-4 text-primary" />
                <span>Tech Stack</span>
              </td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-bg-subtle border border-border-subtle px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold text-text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Integrations */}
            <tr>
              <td className="p-5 font-bold text-text-muted flex items-center gap-1.5">
                <Cable className="w-4 h-4 text-primary" />
                <span>Integrations</span>
              </td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  {tpl.integrations && tpl.integrations.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {tpl.integrations.map((int: string, idx: number) => (
                        <span key={idx} className="bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                          {int}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-text-muted font-mono">None</span>
                  )}
                </td>
              ))}
            </tr>

            {/* AI-Ready Flag */}
            <tr>
              <td className="p-5 font-bold text-text-muted">AI-Ready Pipeline</td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  {tpl.aiReady ? (
                    <Check className="w-4.5 h-4.5 text-emerald-500" />
                  ) : (
                    <X className="w-4.5 h-4.5 text-accent-pink" />
                  )}
                </td>
              ))}
            </tr>

            {/* Backend Enabled */}
            <tr>
              <td className="p-5 font-bold text-text-muted">Database Backend</td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  {tpl.backendEnabled ? (
                    <Check className="w-4.5 h-4.5 text-emerald-500" />
                  ) : (
                    <X className="w-4.5 h-4.5 text-accent-pink" />
                  )}
                </td>
              ))}
            </tr>

            {/* Realtime Socket Sync */}
            <tr>
              <td className="p-5 font-bold text-text-muted">Real-time Sockets</td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  {tpl.realtimeEnabled ? (
                    <Check className="w-4.5 h-4.5 text-emerald-500" />
                  ) : (
                    <X className="w-4.5 h-4.5 text-accent-pink" />
                  )}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-bg-subtle/25">
              <td className="p-5"></td>
              {templates.map(tpl => (
                <td key={tpl.id} className="p-5 border-l border-border-default">
                  <button
                    onClick={() => handleUseTemplate(tpl.id, tpl.name)}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-standard flex items-center justify-center gap-1.5 group"
                  >
                    <span>Use Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* State Machine Console popup */}
      <CloneFlowModal
        templateId={selectedTemplateId}
        templateName={selectedTemplateName}
        isOpen={isCloneFlowOpen}
        onClose={() => {
          setIsCloneFlowOpen(false);
          resetFlow();
        }}
      />
      <ToastContainer />
    </SectionWrapper>
  );
}

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function ComparePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <SectionWrapper className="bg-bg-default pt-10 pb-24 text-center">
            <div className="text-text-muted font-bold py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-mono">Loading Comparison Matrix...</span>
            </div>
          </SectionWrapper>
        }>
          <CompareContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function ComparePageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <ComparePage />
    </PageErrorBoundary>
  );
}

