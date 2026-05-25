'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Code, Play, Layers, Link2, GitBranch, ShieldCheck, 
  Star, StarHalf, Loader2, Sparkles, HelpCircle 
} from 'lucide-react';
import { useTemplateStore } from '../../store/useTemplateStore';
import { Badge } from '../shared/Badge';
import CloneFlowModal from './CloneFlowModal';

type ActiveTab = 'overview' | 'entities' | 'integrations' | 'workflow';

export function TemplateModal() {
  const { selectedTemplate, isModalOpen, closeTemplateDetails } = useTemplateStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isCloneFlowOpen, setIsCloneFlowOpen] = useState(false);

  // States for API fetched data
  const [schemaData, setSchemaData] = useState<{ entities: string[]; schema: any } | null>(null);
  const [integrationsData, setIntegrationsData] = useState<any[]>([]);
  const [workflowData, setWorkflowData] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [prevTemplateId, setPrevTemplateId] = useState<string | null>(null);

  if (selectedTemplate && selectedTemplate.id !== prevTemplateId) {
    setPrevTemplateId(selectedTemplate.id);
    setActiveTab('overview');
    setSchemaData(null);
    setIntegrationsData([]);
    setWorkflowData([]);
  }

  useEffect(() => {
    if (!selectedTemplate) return;

    // Telemetry: detail_open
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'detail_open',
        user_id: 'usr_seeded_developer',
        metadata: { template_id: selectedTemplate.id }
      })
    }).catch(console.error);
  }, [selectedTemplate]);

  useEffect(() => {
    const templateId = selectedTemplate?.id;
    if (!templateId || activeTab === 'overview') return;

    async function fetchTabData() {
      setIsLoading(true);
      try {
        if (activeTab === 'entities') {
          const res = await fetch(`/api/templates/${templateId}/schema`);
          const data = await res.json();
          setSchemaData(data);

          // Telemetry: detail_expand
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'detail_expand',
              user_id: 'usr_seeded_developer',
              metadata: { template_id: templateId }
            })
          });
        } else if (activeTab === 'integrations') {
          const res = await fetch(`/api/templates/${templateId}/integrations`);
          const data = await res.json();
          setIntegrationsData(data.integrations || []);

          // Telemetry: integration_click
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'integration_click',
              user_id: 'usr_seeded_developer',
              metadata: { template_id: templateId }
            })
          });
        } else if (activeTab === 'workflow') {
          const res = await fetch(`/api/templates/${templateId}/workflow`);
          const data = await res.json();
          setWorkflowData(data.workflows || []);

          // Telemetry: workflow_open
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'workflow_open',
              user_id: 'usr_seeded_developer',
              metadata: { template_id: templateId }
            })
          });
        }
      } catch (err) {
        console.error('Failed to fetch tab details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTabData();
  }, [activeTab, selectedTemplate]);

  if (!isModalOpen || !selectedTemplate) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === floor + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-border-default" />);
      }
    }
    return stars;
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in-up">
        {/* Background click listener */}
        <div className="absolute inset-0" onClick={closeTemplateDetails} />

        {/* Slide-over panel */}
        <div className="relative w-full max-w-2xl h-full bg-bg-card border-l border-border-default shadow-2xl flex flex-col justify-between z-10 text-left animate-fade-in-up">
          
          {/* Header */}
          <div className="p-6 border-b border-border-default flex justify-between items-center bg-bg-subtle/50">
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <Badge label={selectedTemplate.category} />
                <Badge label={selectedTemplate.complexity} />
                <div className="bg-bg-subtle border border-border-subtle text-text-muted font-bold text-[10px] px-2 py-0.5 rounded-full font-mono">
                  v{selectedTemplate.version}
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-text-heading leading-tight">
                {selectedTemplate.name}
              </h2>
            </div>
            <button
              onClick={closeTemplateDetails}
              className="p-2 rounded-xl text-text-muted hover:text-text-heading hover:bg-bg-subtle transition-all"
              aria-label="Close template details"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-bg-subtle border-b border-border-subtle flex gap-4 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all ${
                activeTab === 'overview' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all flex items-center gap-1 ${
                activeTab === 'entities' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Entities</span>
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all flex items-center gap-1 ${
                activeTab === 'integrations' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Integrations</span>
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all flex items-center gap-1 ${
                activeTab === 'workflow' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Workflow</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="h-40 flex flex-col items-center justify-center text-text-muted gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs font-mono font-bold">Fetching blueprint specifications...</span>
              </div>
            ) : (
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {selectedTemplate.screenshots && selectedTemplate.screenshots[0] && (
                      <div className="w-full h-48 bg-bg-subtle border border-border-subtle rounded-2xl overflow-hidden shrink-0">
                        <img 
                          src={selectedTemplate.screenshots[0]} 
                          alt={selectedTemplate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                        About this blueprint
                      </h4>
                      <p className="text-sm text-text-body font-semibold leading-relaxed">
                        {selectedTemplate.longDescription}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                        Core Specifications
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTemplate.features.map((feat) => (
                          <div
                            key={feat}
                            className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border-subtle bg-bg-subtle/30"
                          >
                            <Check className="h-4.5 w-4.5 text-accent-blue shrink-0" />
                            <span className="text-xs md:text-sm text-text-heading font-extrabold">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ENTITIES TAB */}
                {activeTab === 'entities' && schemaData && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                        Included Entities Mappings
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {schemaData.entities.map(ent => (
                          <span key={ent} className="bg-primary/10 border border-primary/20 text-primary font-bold font-mono text-xs px-3 py-1 rounded-lg">
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>

                    {schemaData.schema?.components && (
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2">
                          <Code className="h-4.5 w-4.5 text-primary" />
                          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                            Database Structure Schema
                          </h4>
                        </div>
                        <div className="bg-black text-emerald-400 p-5 rounded-2xl font-mono text-xs max-h-72 overflow-y-auto border border-white/10 select-text">
                          <pre className="leading-relaxed">
                            <code>{JSON.stringify(schemaData.schema, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. INTEGRATIONS TAB */}
                {activeTab === 'integrations' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono mb-2">
                      Connected APIs & Platforms
                    </h4>
                    {integrationsData.length === 0 ? (
                      <p className="text-xs text-text-muted">No external integrations configured for this blueprint.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {integrationsData.map((integration, idx) => (
                          <div 
                            key={idx}
                            className="bg-bg-subtle/40 border border-border-default rounded-2xl p-4 flex gap-3 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="w-10 h-10 bg-primary/10 border border-primary/25 rounded-xl flex items-center justify-center text-primary shrink-0 font-bold uppercase text-[10px]">
                              {integration.name.slice(0, 2)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs md:text-sm font-extrabold text-text-heading leading-none">
                                  {integration.name}
                                </h5>
                                <span className="bg-bg-subtle text-text-muted font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                                  {integration.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-text-muted font-semibold leading-relaxed">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. WORKFLOW TAB */}
                {activeTab === 'workflow' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono mb-2">
                      Trigger / Action Diagrams
                    </h4>
                    {workflowData.length === 0 ? (
                      <p className="text-xs text-text-muted">No automation workflows configured for this blueprint.</p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {workflowData.map((flow, idx) => (
                          <div 
                            key={idx}
                            className="bg-bg-subtle/40 border border-border-default rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm"
                          >
                            {/* Trigger Block */}
                            <div className="flex-1 bg-bg-card border border-border-subtle p-3.5 rounded-xl w-full text-center space-y-1">
                              <span className="bg-amber-500/10 border border-amber-500/25 text-amber-500 font-bold text-[8px] px-2 py-0.5 rounded-full tracking-wider font-mono uppercase">
                                TRIGGER
                              </span>
                              <h5 className="text-xs font-extrabold text-text-heading font-mono leading-relaxed mt-1">
                                {flow.trigger.label}
                              </h5>
                            </div>

                            {/* Arrow Connection */}
                            <div className="flex items-center gap-1 text-primary shrink-0 rotate-90 md:rotate-0">
                              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            </div>

                            {/* Action Block */}
                            <div className="flex-1 bg-bg-card border border-border-subtle p-3.5 rounded-xl w-full text-center space-y-1">
                              <span className="bg-accent-blue/10 border border-accent-blue/25 text-accent-blue font-bold text-[8px] px-2 py-0.5 rounded-full tracking-wider font-mono uppercase">
                                ACTION
                              </span>
                              <h5 className="text-xs font-extrabold text-text-heading font-mono leading-relaxed mt-1">
                                {flow.action.label}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Details & Primary Action */}
          <div className="p-6 border-t border-border-default bg-bg-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            {/* Stats Summary */}
            <div className="flex items-center gap-4 text-xs font-semibold text-text-muted">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted font-bold font-mono uppercase">BLUEPRINT TRUST</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-extrabold text-text-heading font-mono">{selectedTemplate.rating}</span>
                  <div className="flex">{renderStars(selectedTemplate.rating)}</div>
                </div>
              </div>

              <div className="w-px h-8 bg-border-subtle" />

              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted font-bold font-mono uppercase">MARKET USAGE</span>
                <span className="font-mono text-text-heading font-extrabold mt-0.5">
                  {selectedTemplate.cloneCount} instances
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={() => setIsCloneFlowOpen(true)}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-current animate-pulse" />
                <span>Use Blueprint Template</span>
              </button>
              <button
                onClick={closeTemplateDetails}
                className="px-5 py-3.5 rounded-xl border border-border-default bg-bg-card hover:bg-bg-subtle text-text-heading font-bold text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 15-Step Clone Flow Console Modal */}
      <CloneFlowModal
        templateId={selectedTemplate.id}
        templateName={selectedTemplate.name}
        isOpen={isCloneFlowOpen}
        onClose={() => {
          setIsCloneFlowOpen(false);
          closeTemplateDetails();
        }}
      />
    </>
  );
}

export default TemplateModal;
