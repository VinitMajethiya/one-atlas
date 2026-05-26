'use client';

import React, { useState } from 'react';
import { PageErrorBoundary } from '@/components/shared/PageErrorBoundary';
import Navbar from '../../../components/nav/Navbar';
import Footer from '../../../components/shared/Footer';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import ToastContainer from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, GitFork, Play, Settings, Plus, Trash2, Save, Sparkles,
  Database, RefreshCw, Layers, Sliders, Activity, HelpCircle, Info
} from 'lucide-react';

type WorkflowBlock = {
  trigger_id?: string;
  condition_id?: string;
  api_call_id?: string;
  branch_id?: string;
  schedule_id?: string;
  webhook_id?: string;
  approval_id?: string;
  retry_id?: string;
  log_id?: string;
  template_id: string;
  workspace_id: string;
  metadata: Record<string, unknown> & Record<string, any>;
  id: string;
  label: string;
  type: 'trigger' | 'condition' | 'api_call' | 'branch' | 'schedule' | 'webhook' | 'approval' | 'retry' | 'log';
};

const BLOCK_TYPES = [
  'Trigger', 'Condition', 'API Call', 'Branch', 
  'Schedule', 'Webhook', 'Approval', 'Retry', 'Log'
] as const;

const AVAILABLE_BLOCKS: { type: WorkflowBlock['type']; label: string; desc: string; color: string }[] = [
  { type: 'trigger', label: 'Trigger Event', desc: 'Webhook, schedule, or table row mutation', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' },
  { type: 'condition', label: 'Condition Filter', desc: 'Branch based on custom variable checks', color: 'border-amber-500/20 bg-amber-500/5 text-amber-500' },
  { type: 'api_call', label: 'API Call', desc: 'POST/GET queries to third-party endpoints', color: 'border-accent-blue/20 bg-accent-blue/5 text-accent-blue' },
  { type: 'branch', label: 'Split Branch', desc: 'Fork workflow into multi-lane queries', color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-500' },
  { type: 'schedule', label: 'Schedule Timer', desc: 'Interval timer or standard cron trigger', color: 'border-violet-500/20 bg-violet-500/5 text-violet-500' },
  { type: 'webhook', label: 'Webhook Receiver', desc: 'Trigger workflow via incoming HTTP query', color: 'border-teal-500/20 bg-teal-500/5 text-teal-500' },
  { type: 'approval', label: 'Team Approval', desc: 'Pause workflow pending user validation', color: 'border-rose-500/20 bg-rose-500/5 text-rose-500' },
  { type: 'retry', label: 'Failure Retry', desc: 'Re-run target pipeline up to 3 times', color: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-500' },
  { type: 'log', label: 'Audit Log write', desc: 'Write payload variables to ActivityLog table', color: 'border-zinc-500/20 bg-zinc-500/5 text-zinc-500' },
];

function WorkflowBuilderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [blocks, setBlocks] = useState<WorkflowBlock[]>([
    { id: 'block_1', type: 'trigger', label: 'Customer signup event', metadata: { source: 'database_trigger' }, template_id: 'usr_seeded_dev_tpl', workspace_id: 'ws_seeded_dev', trigger_id: 'block_1' },
    { id: 'block_2', type: 'condition', label: 'Verify enterprise plan status', metadata: { rule: 'user.plan === "enterprise"' }, template_id: 'usr_seeded_dev_tpl', workspace_id: 'ws_seeded_dev', condition_id: 'block_2' },
    { id: 'block_3', type: 'api_call', label: 'Trigger slack alert message', metadata: { url: 'https://hooks.slack.com/services/...' }, template_id: 'usr_seeded_dev_tpl', workspace_id: 'ws_seeded_dev', api_call_id: 'block_3' },
    { id: 'block_4', type: 'log', label: 'Log validation outcome', metadata: { level: 'info' }, template_id: 'usr_seeded_dev_tpl', workspace_id: 'ws_seeded_dev', log_id: 'block_4' },
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block_1');
  const [saving, setSaving] = useState(false);

  const activeBlock = blocks.find(b => b.id === selectedBlockId);

  const addBlock = (type: WorkflowBlock['type'], label: string) => {
    const newId = `block_${Math.random().toString(36).substring(2, 9)}`;
    const newBlock: WorkflowBlock = {
      id: newId,
      type,
      label: `New ${label}`,
      metadata: {},
      template_id: 'usr_seeded_dev_tpl',
      workspace_id: 'ws_seeded_dev',
      [`${type}_id`]: newId,
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newId);
    toast(`Added ${label} block to canvas`, 'info');
  };

  const removeBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    toast('Block deleted from canvas', 'warning');
  };

  const updateActiveBlockLabel = (newLabel: string) => {
    if (!selectedBlockId) return;
    setBlocks(prev => prev.map(b => b.id === selectedBlockId ? { ...b, label: newLabel } : b));
  };

  const updateActiveBlockMetadata = (key: string, value: any) => {
    if (!selectedBlockId) return;
    setBlocks(prev => prev.map(b => b.id === selectedBlockId ? { 
      ...b, 
      metadata: { ...b.metadata, [key]: value } 
    } : b));
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      // Simulate save and fire workflow_save telemetry event
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'workflow_open', // Reuse or flag as workflow mutation
          user_id: 'usr_seeded_developer',
          metadata: { 
            block_count: blocks.length,
            blocks: blocks.map(b => ({ type: b.type, id: b.id }))
          }
        })
      });

      toast('Workflow configuration synchronized successfully!', 'success');
    } catch {
      toast('Failed to save workflow', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative flex flex-col min-h-[80vh]">
          {/* Back link */}
          <button 
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Marketplace</span>
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight flex items-center gap-2">
                <GitFork className="w-6 h-6 text-primary" />
                <span>Visual Automation Builder</span>
              </h1>
              <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
                Construct and link trigger/action flows for blueprint sandboxes
              </p>
            </div>

            <button
              onClick={saveWorkflow}
              disabled={saving}
              className="bg-primary hover:bg-primary/95 disabled:opacity-50 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-standard flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Workflow Configuration</span>
            </button>
          </div>

          {/* Work Area Grid */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px]">
            {/* Sidebar list of templates blocks */}
            <div className="lg:col-span-1 border border-border-default bg-bg-card rounded-3xl p-5 shadow-sm space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider font-mono mb-1">
                  Workflow Blocks
                </h3>
                <p className="text-[10px] text-text-muted font-semibold">
                  Click on any block to drop it onto your visualization canvas.
                </p>
              </div>

              <div className="space-y-3.5">
                {AVAILABLE_BLOCKS.map(block => (
                  <button
                    key={block.type}
                    onClick={() => addBlock(block.type, block.label)}
                    className={`w-full p-3.5 border rounded-2xl text-left hover:scale-[1.02] transition-all group flex items-start gap-3 select-none ${block.color}`}
                  >
                    <Plus className="w-4 h-4 shrink-0 mt-0.5 group-hover:rotate-90 transition-transform" />
                    <div>
                      <h4 className="text-xs font-bold font-sans uppercase tracking-wide leading-none mb-1">
                        {block.label}
                      </h4>
                      <p className="text-[9px] text-text-muted font-semibold leading-normal">
                        {block.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Main Canvas Area */}
            <div className="lg:col-span-2 border border-border-default bg-bg-card/40 rounded-3xl p-6 shadow-sm overflow-y-auto min-h-[400px] flex flex-col justify-start relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
              {blocks.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <Sliders className="w-12 h-12 text-text-muted animate-pulse" />
                  <h4 className="text-sm font-extrabold text-text-heading">Canvas is empty</h4>
                  <p className="text-xs text-text-muted font-semibold max-w-xs leading-relaxed">
                    Select a trigger block from the left panel to begin mapping your operational layout.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 items-center w-full py-4 relative">
                  {blocks.map((block, idx) => (
                    <React.Fragment key={block.id}>
                      <div
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`w-full max-w-md p-4 bg-bg-card border rounded-2xl flex justify-between items-center shadow-sm cursor-pointer select-none  transition-all ${
                          selectedBlockId === block.id 
                            ? 'border-primary shadow-primary/5 ring-1 ring-primary/20' 
                            : 'border-border-default hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-text-muted select-none">
                            {idx + 1}
                          </span>
                          <div className="text-left">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-primary block mb-0.5">
                              {block.type.replace('_', ' ')}
                            </span>
                            <h4 className="text-xs font-bold text-text-heading leading-tight">
                              {block.label}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={(e) => removeBlock(block.id, e)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-accent-pink hover:bg-bg-subtle transition-colors"
                          title="Remove block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Connection Indicator */}
                      {idx < blocks.length - 1 && (
                        <div className="h-6 w-0.5 bg-border-default flex items-center justify-center relative">
                          <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Right configuration side drawer */}
            <div className="lg:col-span-1 border border-border-default bg-bg-card rounded-3xl p-5 shadow-sm space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider font-mono mb-1">
                  Block Inspector
                </h3>
                <p className="text-[10px] text-text-muted font-semibold">
                  Configure the parameters and variables for the selected block.
                </p>
              </div>

              {activeBlock ? (
                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider">
                      Block ID
                    </label>
                    <span className="font-mono text-text-heading text-[10px] select-all bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle block">
                      {activeBlock.id}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider">
                      Block Name
                    </label>
                    <input
                      type="text"
                      value={activeBlock.label}
                      onChange={(e) => updateActiveBlockLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-bg-subtle/50 border border-border-default focus:border-primary text-xs font-semibold rounded-xl outline-none transition-all"
                    />
                  </div>

                  {/* Dynamic metadata inputs */}
                  <div className="h-px bg-border-subtle my-4" />
                  
                  <div>
                    <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono mb-2">
                      Block Parameters
                    </h5>
                    <div className="space-y-3">
                      {activeBlock.type === 'trigger' && (
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold font-mono text-text-muted uppercase">Source Type</label>
                          <select
                            value={activeBlock.metadata.source || 'database_trigger'}
                            onChange={(e) => updateActiveBlockMetadata('source', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-bg-subtle/50 border border-border-subtle text-xs font-semibold rounded-lg"
                          >
                            <option value="database_trigger">Database Mutation</option>
                            <option value="http_request">Incoming Request</option>
                            <option value="timer">Scheduled Timer</option>
                          </select>
                        </div>
                      )}

                      {activeBlock.type === 'condition' && (
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold font-mono text-text-muted uppercase">JS Expression</label>
                          <textarea
                            value={activeBlock.metadata.rule || ''}
                            onChange={(e) => updateActiveBlockMetadata('rule', e.target.value)}
                            className="w-full px-3 py-2 bg-bg-subtle/50 border border-border-subtle text-xs font-mono rounded-lg h-20 outline-none focus:border-primary resize-none"
                            placeholder="user.plan === 'enterprise'"
                          />
                        </div>
                      )}

                      {activeBlock.type === 'api_call' && (
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold font-mono text-text-muted uppercase">Endpoint URL</label>
                          <input
                            type="text"
                            value={activeBlock.metadata.url || ''}
                            onChange={(e) => updateActiveBlockMetadata('url', e.target.value)}
                            className="w-full px-3 py-2 bg-bg-subtle/50 border border-border-subtle text-xs font-mono rounded-lg outline-none focus:border-primary"
                            placeholder="https://hooks.slack.com/services/..."
                          />
                        </div>
                      )}

                      {/* Generic attributes fallback */}
                      {Object.keys(activeBlock.metadata).length === 0 && (
                        <div className="flex items-start gap-2 bg-bg-subtle p-3.5 rounded-xl border border-border-subtle text-[10px] text-text-muted">
                          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>No advanced properties are required for this block. Use block name to label its output logs.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-text-muted text-xs">
                  Select a block on the canvas to configure parameters.
                </div>
              )}
            </div>
          </div>

          <ToastContainer />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

export default function WorkflowBuilderPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <WorkflowBuilderPage />
    </PageErrorBoundary>
  );
}
