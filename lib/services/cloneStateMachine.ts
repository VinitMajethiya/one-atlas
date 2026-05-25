export type CloneState =
  | 'idle_browse'
  | 'card_hover'
  | 'preview_open'
  | 'cta_click'
  | 'auth_check'
  | 'auth_success'
  | 'plan_gate'
  | 'clone_queued'
  | 'workspace_create'
  | 'ai_context_ready'
  | 'generate_changes'
  | 'validate'
  | 'deploy_queued'
  | 'deploy_success'
  | 'deploy_error';

export interface CloneStepInfo {
  step: number;
  name: CloneState;
  label: string;
  description?: string;
  telemetryEvent?: string;
  telemetry?: string;
  db?: string;
}

export const CLONE_STEPS: CloneStepInfo[] = [
  { 
    step: 1, 
    name: 'idle_browse', 
    label: 'Browsing templates',
    telemetry: 'templates_page_view',
    db: 'Event'
  },
  { 
    step: 2, 
    name: 'card_hover', 
    label: 'Previewing template',
    telemetry: 'template_hover', 
    db: 'Event'
  },
  { step: 3, name: 'preview_open', label: 'Previewing Details', description: 'Opening blueprint specification slide-over', telemetryEvent: 'template_open' },
  { step: 4, name: 'cta_click', label: 'Initializing Flow', description: 'Starting clone wizard', telemetryEvent: 'use_template_click' },
  { step: 5, name: 'auth_check', label: 'Checking Authentication', description: 'Verifying session state', telemetryEvent: 'login_prompt_shown' },
  { step: 6, name: 'auth_success', label: 'Authenticated', description: 'Session verified', telemetryEvent: 'auth_success' },
  { step: 7, name: 'plan_gate', label: 'Checking Plan Entitlements', description: 'Verifying feature gates', telemetryEvent: 'plan_gate_shown' },
  { step: 8, name: 'clone_queued', label: 'Queueing Clone Job', description: 'Registering clone operation in registry', telemetryEvent: 'clone_start' },
  { step: 9, name: 'workspace_create', label: 'Initializing Sandbox', description: 'Creating secure workspace instance', telemetryEvent: 'workspace_created' },
  { step: 10, name: 'ai_context_ready', label: 'Loading AI Context', description: 'Hydrating design tokens and schema snapshots', telemetryEvent: 'ai_customize_open' },
  { step: 11, name: 'generate_changes', label: 'Applying AI Customizations', description: 'Generating code diffs and layout overrides', telemetryEvent: 'ai_generate' },
  { step: 12, name: 'validate', label: 'Running Quality Assurance', description: 'Verifying syntax rules and schema connections', telemetryEvent: 'validate' },
  { step: 13, name: 'deploy_queued', label: 'Queueing Cloud Deployment', description: 'Building sandboxed container environment', telemetryEvent: 'deploy_start' },
  { step: 14, name: 'deploy_success', label: 'Application Live', description: 'Provisioning live domain complete', telemetryEvent: 'deploy_success' },
  { step: 15, name: 'deploy_error', label: 'Deployment Interrupted', description: 'Failed to deploy live domain', telemetryEvent: 'deploy_error' }
];

export function getStepInfo(state: CloneState): CloneStepInfo {
  const match = CLONE_STEPS.find(s => s.name === state);
  if (!match) {
    throw new Error(`Invalid clone state name: ${state}`);
  }
  return match;
}
