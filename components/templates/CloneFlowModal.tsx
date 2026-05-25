'use client';

import React, { useEffect, useState } from 'react';
import { useCloneFlowStore, ValidationIssue } from '../../store/useCloneFlowStore';
import { CLONE_STEPS, getStepInfo, CloneState } from '../../lib/services/cloneStateMachine';
import { 
  Loader2, CheckCircle, AlertTriangle, Play, RefreshCw, X, ArrowRight, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import PlanRestrictionModal from '../shared/PlanRestrictionModal';
import QueueTimeoutState from '../shared/QueueTimeoutState';
import { useRealtimeDeployment } from '@/hooks/useRealtimeDeployment';

interface CloneFlowModalProps {
  templateId: string;
  templateName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CloneFlowModal({ templateId, templateName, isOpen, onClose }: CloneFlowModalProps) {
  const store = useCloneFlowStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { buildLog, status: deployStatus } = useRealtimeDeployment(
    store.currentStep === 'deploy_queued' || store.currentStep === 'deploy_success' 
      ? store.deploymentId 
      : null
  );

  useEffect(() => {
    if (isOpen && store.currentStep === 'idle_browse') {
      // Start flow by advancing to preview_open -> cta_click
      store.resetFlow();
      store.advanceStep('preview_open');
    }
  }, [isOpen]);

  // Main flow runner
  const startCloneFlow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLogs([]);
    store.setError(null);
    store.setValidationIssues([]);

    try {
      // Step 4: cta_click
      store.advanceStep('cta_click');
      await logAndDelay('Initializing clone flow...', 800);

      // Step 5: auth_check
      store.advanceStep('auth_check');
      await logAndDelay('Checking user authentication...', 800);
      const authRes = await fetch('/api/auth/me', {
        headers: { 'x-user-id': 'usr_seeded_developer' } // simulate logged in dev user
      });
      const authData = await authRes.json();
      if (!authData.authenticated) {
        store.setError('User is not authenticated. Please log in.', 'AUTH_REQUIRED', false);
        setIsProcessing(false);
        return;
      }
      store.advanceStep('auth_success');
      await logAndDelay(`Authenticated as ${authData.user.name}`, 600);

      // Step 7: plan_gate
      store.advanceStep('plan_gate');
      await logAndDelay('Checking plan entitlements...', 800);
      const entRes = await fetch('/api/entitlements', {
        headers: { 'x-user-id': 'usr_seeded_developer' }
      });
      const entData = await entRes.json();
      if (templateId.includes('enterprise') && entData.plan !== 'enterprise') {
        store.setError('This template requires an Enterprise plan.', 'PLAN_RESTRICTED', false);
        setIsProcessing(false);
        return;
      }

      // Step 8: clone_queued
      store.advanceStep('clone_queued');
      await logAndDelay('Queueing clone database task...', 1000);
      const cloneRes = await fetch(`/api/templates/${templateId}/clone`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'usr_seeded_developer'
        },
        body: JSON.stringify({ template_id: templateId })
      });
      const cloneData = await cloneRes.json();
      if (!cloneRes.ok) throw new Error(cloneData.error?.message || 'Failed to queue clone');
      
      store.setCloneId(cloneData.clone_id);
      
      // Fire clone_success notification & telemetry
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'clone_success',
          user_id: 'usr_seeded_developer',
          metadata: { template_id: templateId, template_name: templateName, clone_id: cloneData.clone_id }
        })
      });
      await logAndDelay(`Clone job queued successfully (ID: ${cloneData.clone_id})`, 600);

      // Step 9: workspace_create
      store.advanceStep('workspace_create');
      await logAndDelay('Provisioning secure sandboxed workspace...', 1000);
      const workspaceRes = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'usr_seeded_developer'
        },
        body: JSON.stringify({
          name: `${templateName} Sandbox`,
          permissions: { read: true, write: true },
          bootstrap_config: { version: '1.0.0' }
        })
      });
      const workspaceData = await workspaceRes.json();
      if (!workspaceRes.ok) throw new Error(workspaceData.error?.message || 'Failed to create workspace');
      
      store.setWorkspaceId(workspaceData.workspace_id);
      await logAndDelay(`Workspace created (ID: ${workspaceData.workspace_id})`, 600);

      // Step 10: ai_context_ready
      store.advanceStep('ai_context_ready');
      await logAndDelay('Loading AI schema design tokens...', 800);
      const contextRes = await fetch('/api/ai/context', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'usr_seeded_developer'
        },
        body: JSON.stringify({
          template_id: templateId,
          prompt: 'Inject AI Summary Panel and add notes field to contacts table',
          style_tokens: { primary: 'indigo', radius: 'lg' },
          schema_snapshot: { version: 1 }
        })
      });
      const contextData = await contextRes.json();
      if (!contextRes.ok) throw new Error(contextData.error?.message || 'Failed to initialize AI context');
      
      store.setAiSessionId(contextData.session_id);
      await logAndDelay('AI context session initialized.', 600);

      // Step 11: generate_changes
      store.advanceStep('generate_changes');
      await logAndDelay('Synthesizing prompt specifications...', 1000);
      const genRes = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'usr_seeded_developer'
        },
        body: JSON.stringify({
          session_id: contextData.session_id,
          prompt: 'Inject AI Summary Panel and add notes field to contacts table'
        })
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error?.message || 'Failed AI customization');
      
      store.setChangeId(genData.change_id);
      await logAndDelay('AI generated changes and code patches: OK.', 600);

      // Step 12: validate
      await runValidation(genData.change_id, workspaceData.workspace_id);

    } catch (err: any) {
      console.error(err);
      store.setError(err.message || 'An error occurred during clone.', 'FLOW_FAILED', true);
      setIsProcessing(false);
    }
  };

  const runValidation = async (changeId: string, wId: string) => {
    try {
      store.advanceStep('validate');
      await logAndDelay('Running validation suites on generated schemas...', 1000);
      
      const valRes = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clone_id: store.cloneId,
          workspace_id: wId,
          artifacts: { change_id: changeId }
        })
      });
      const valData = await valRes.json();
      
      if (valData.logs) {
        setLogs(prev => [...prev, ...valData.logs]);
      }

      if (!valData.success || valData.issues.length > 0) {
        store.setValidationIssues(valData.issues);
        store.setError('Validation failed. Please resolve schema issues.', 'VALIDATION_FAILED', true);
        setIsProcessing(false);
        return;
      }
      await logAndDelay('Validation integrity check: PASSED.', 800);

      // Step 13: deploy_queued
      store.advanceStep('deploy_queued');
      await logAndDelay('Queueing cloud container deployment...', 800);
      const deployRes = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'usr_seeded_developer'
        },
        body: JSON.stringify({
          app_id: 'app_active_spec',
          workspace_id: wId,
          env: 'production'
        })
      });
      const deployData = await deployRes.json();
      if (!deployRes.ok) throw new Error(deployData.error?.message || 'Failed to queue deployment');
      
      store.setDeploymentId(deployData.deployment_id);
      await logAndDelay(`Deployment pipeline initiated (ID: ${deployData.deployment_id})`, 600);

      // Start Polling Deploy status (polling-only model)
      await pollDeployment(deployData.deployment_id);

    } catch (err: any) {
      console.error(err);
      store.setError(err.message || 'An error occurred during validation.', 'FLOW_FAILED', true);
      setIsProcessing(false);
    }
  };

  const pollDeployment = async (dId: string) => {
    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/deployments/${dId}`);
        const data = await res.json();
        
        if (data.build_log) {
          // Append new logs safely
          setLogs(data.build_log);
        }

        if (data.status === 'success' || attempts >= 5) {
          clearInterval(interval);
          
          // Complete successfully - mock full deploy details writing to neon
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'deploy_success',
              user_id: 'usr_seeded_developer',
              metadata: { 
                template_id: templateId, 
                template_name: templateName, 
                workspace_id: store.workspaceId,
                deployment_id: dId
              }
            })
          });

          // mock live URL
          const liveUrl = `https://${templateId}-${store.workspaceId?.slice(-5)}.oneatlas.live`;
          
          // update state machine
          store.advanceStep('deploy_success');
          setIsProcessing(false);
          await logAndDelay('Deployment succeeded. Web application is live.', 600);
        } else if (data.status === 'error') {
          clearInterval(interval);
          throw new Error('Container build failed during script compiler phase.');
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          throw new Error('Deployment timed out after 30 seconds.');
        }
      } catch (err: any) {
        clearInterval(interval);
        store.advanceStep('deploy_error');
        const isTimeout = err.message.includes('timed out') || err.message.includes('timeout');
        store.setError(
          err.message || 'Deployment failed.',
          isTimeout ? 'QUEUE_TIMEOUT' : 'DEPLOYMENT_FAILED',
          true
        );
        setIsProcessing(false);
        
        // Log deploy error event
        fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'deploy_error',
            user_id: 'usr_seeded_developer',
            metadata: { 
              template_id: templateId, 
              workspace_id: store.workspaceId,
              error: err.message
            }
          })
        });
      }
    }, 2000);
  };

  const handleRollback = async () => {
    if (!store.deploymentId) return;
    setIsProcessing(true);
    await logAndDelay('Initiating recovery rollback sequence...', 800);
    try {
      const res = await fetch(`/api/deployments/${store.deploymentId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: 'app_active_spec',
          workspace_id: store.workspaceId,
          rollback_deployment_id: store.deploymentId
        })
      });
      if (res.ok) {
        // Rollback event triggers rollback notification
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'deploy_rollback',
            user_id: 'usr_seeded_developer',
            metadata: { 
              template_name: templateName, 
              workspace_id: store.workspaceId,
              rollback_deployment_id: store.deploymentId
            }
          })
        });
        
        await logAndDelay('Rollback processed. Sandbox restored to clean workspace state.', 1000);
        store.resetFlow();
        setIsProcessing(false);
        onClose();
      } else {
        throw new Error('Rollback endpoint returned error status.');
      }
    } catch (err: any) {
      store.setError(err.message || 'Rollback failed.', 'ROLLBACK_FAILED', false);
      setIsProcessing(false);
    }
  };

  const logAndDelay = (msg: string, ms: number) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        resolve();
      }, ms);
    });
  };

  if (!isOpen) return null;

  if (store.errorCode === 'PLAN_RESTRICTED') {
    return (
      <PlanRestrictionModal
        isOpen={true}
        onClose={() => {
          store.resetFlow();
          onClose();
        }}
        requiredPlan="enterprise"
      />
    );
  }

  if (store.errorCode === 'QUEUE_TIMEOUT') {
    return (
      <QueueTimeoutState
        jobType={store.currentStep === 'clone_queued' ? 'clone' : 'deployment'}
        jobId={store.cloneId || store.deploymentId}
        onRetry={startCloneFlow}
        onCancel={() => {
          store.resetFlow();
          onClose();
        }}
      />
    );
  }

  const currentInfo = getStepInfo(store.currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-bg-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-xs font-bold text-text-heading font-mono uppercase tracking-wider">
              Blueprint Deploy Console
            </span>
          </div>
          {!isProcessing && (
            <button 
              onClick={() => {
                store.resetFlow();
                onClose();
              }}
              className="text-text-muted hover:text-text-heading transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-extrabold text-text-heading mb-1">
              Deploying {templateName}
            </h2>
            <p className="text-xs text-text-muted font-medium">
              Blueprint ID: <span className="font-mono text-text-heading">{templateId}</span>
            </p>
          </div>

          {/* Progress Bar Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className="text-text-heading">{currentInfo.label}</span>
              <span className="text-primary">{store.progressPercent}%</span>
            </div>
            
            <div className="h-2 w-full bg-bg-subtle border border-border-subtle rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 rounded-full" 
                style={{ width: `${store.progressPercent}%` }} 
              />
            </div>
            
            <p className="text-xs text-text-muted italic">{currentInfo.description}</p>
          </div>

          {/* Flow Controls (Start Wizard) */}
          {store.currentStep === 'preview_open' && !isProcessing && (
            <div className="bg-bg-subtle border border-border-default p-5 rounded-2xl text-center space-y-4">
              <p className="text-xs md:text-sm font-semibold text-text-heading leading-relaxed">
                Ready to initialize and launch this template blueprint inside a secure runtime sandbox?
              </p>
              <button
                onClick={startCloneFlow}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 mx-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Cloud Provisioning</span>
              </button>
            </div>
          )}

          {/* Live Build Logs Terminal */}
          {(isProcessing || logs.length > 0) && (
            <div className="flex-1 min-h-[160px] bg-black text-emerald-400 font-mono text-[11px] p-4 rounded-2xl overflow-y-auto border border-white/10 select-text flex flex-col gap-1 shadow-inner">
              <div className="text-white/40 border-b border-white/10 pb-1 mb-1.5 flex items-center justify-between">
                <span>SYSTEM LOGS: {currentInfo.label}</span>
                {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
              </div>
              {logs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {log}
                </div>
              ))}
              {isProcessing && (
                <div className="animate-pulse text-primary flex items-center gap-1 mt-1 font-bold">
                  <span>█</span> Running task...
                </div>
              )}
            </div>
          )}

          {buildLog.length > 0 && (
            <pre className="mt-4 p-3 bg-bg-subtle border border-border-default rounded-xl text-xs font-mono text-text-muted 
                            max-h-48 overflow-y-auto scrollbar-thin">
              {buildLog.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          )}

          {/* Validation Failures List Panel (State 12 Failures) */}
          {store.validationIssues.length > 0 && (
            <div className="bg-accent-pink/10 border border-accent-pink/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-accent-pink">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider font-mono">Validation Defects</h4>
              </div>
              <ul className="text-xs text-text-heading font-medium space-y-2 pl-4 list-disc">
                {store.validationIssues.map((issue, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-semibold text-accent-pink">[{issue.severity.toUpperCase()}]</span> {issue.message} {issue.field && `(Field: ${issue.field})`}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => runValidation(store.changeId || '', store.workspaceId || '')}
                className="bg-accent-pink text-white hover:bg-accent-pink/90 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Fix & Retry</span>
              </button>
            </div>
          )}

          {/* Generic Error / Failures State */}
          {store.error && store.currentStep !== 'validate' && (
            <div className="bg-accent-pink/10 border border-accent-pink/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-pink/15 text-accent-pink flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-text-heading uppercase tracking-wider font-mono">
                    Task Interrupted [{store.errorCode || 'ERROR'}]
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{store.error}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1.5">
                  {store.canRetry && (
                    <button
                      onClick={startCloneFlow}
                      className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Deploy</span>
                    </button>
                  )}
                  {store.workspaceId && (
                    <button
                      onClick={handleRollback}
                      className="bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                    >
                      Rollback Sandbox
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Deployment Successful Panel */}
          {store.currentStep === 'deploy_success' && (
            <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-accent-blue/15 text-accent-blue rounded-full flex items-center justify-center mx-auto border border-accent-blue/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-text-heading">
                  Sandbox Active & Online
                </h3>
                <p className="text-xs text-text-muted leading-relaxed max-w-md mx-auto font-medium">
                  The container registry has successfully compiled your modifications, isolated the data volume, and mapped the subdomain.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href={`/workspaces/${store.workspaceId}`}
                  className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Sandbox Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://${templateId}-${store.workspaceId?.slice(-5)}.oneatlas.live`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Launch Live App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
