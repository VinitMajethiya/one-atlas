import { create } from 'zustand';
import { CloneState, getStepInfo } from '../lib/services/cloneStateMachine';

export interface ValidationIssue {
  id: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

interface CloneFlowState {
  currentStep: CloneState;
  cloneId: string | null;
  workspaceId: string | null;
  deploymentId: string | null;
  aiSessionId: string | null;
  changeId: string | null;
  validationIssues: ValidationIssue[];
  error: string | null;
  errorCode: string | null;
  canRetry: boolean;
  progressPercent: number;

  advanceStep: (nextStep: CloneState) => void;
  setError: (message: string | null, code?: string | null, retryable?: boolean) => void;
  setChangeId: (changeId: string | null) => void;
  setValidationIssues: (issues: ValidationIssue[]) => void;
  resetFlow: () => void;
  setCloneId: (id: string | null) => void;
  setWorkspaceId: (id: string | null) => void;
  setDeploymentId: (id: string | null) => void;
  setAiSessionId: (id: string | null) => void;
  rollback: () => Promise<boolean>;
}

export const useCloneFlowStore = create<CloneFlowState>((set, get) => ({
  currentStep: 'idle_browse',
  cloneId: null,
  workspaceId: null,
  deploymentId: null,
  aiSessionId: null,
  changeId: null,
  validationIssues: [],
  error: null,
  errorCode: null,
  canRetry: false,
  progressPercent: 7,

  advanceStep: (nextStep) => set(() => {
    const info = getStepInfo(nextStep);
    return {
      currentStep: nextStep,
      progressPercent: Math.round((info.step / 15) * 100),
      error: null,
      errorCode: null,
    };
  }),

  setError: (message, code = null, retryable = false) => set({
    error: message,
    errorCode: code,
    canRetry: retryable,
  }),

  setChangeId: (changeId) => set({ changeId }),
  setValidationIssues: (validationIssues) => set({ validationIssues }),
  setCloneId: (cloneId) => set({ cloneId }),
  setWorkspaceId: (workspaceId) => set({ workspaceId }),
  setDeploymentId: (deploymentId) => set({ deploymentId }),
  setAiSessionId: (aiSessionId) => set({ aiSessionId }),

  resetFlow: () => set({
    currentStep: 'idle_browse',
    cloneId: null,
    workspaceId: null,
    deploymentId: null,
    aiSessionId: null,
    changeId: null,
    validationIssues: [],
    error: null,
    errorCode: null,
    canRetry: false,
    progressPercent: 7,
  }),

  rollback: async () => {
    const { deploymentId, workspaceId } = get();
    if (!deploymentId) return false;
    try {
      const res = await fetch(`/api/deployments/${deploymentId}/rollback`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'usr_seeded_developer'
        },
        body: JSON.stringify({
          app_id: 'app_active_spec',
          workspace_id: workspaceId,
          rollback_deployment_id: deploymentId
        })
      });
      if (res.ok) {
        set({
          currentStep: 'idle_browse',
          cloneId: null,
          workspaceId: null,
          deploymentId: null,
          aiSessionId: null,
          changeId: null,
          validationIssues: [],
          error: null,
          errorCode: null,
          canRetry: false,
          progressPercent: 7,
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Rollback failed:', err);
      return false;
    }
  }
}));
