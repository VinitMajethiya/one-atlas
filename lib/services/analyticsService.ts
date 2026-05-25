export interface AnalyticsEvent {
  event_type: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export const analyticsService = {
  track: async (eventType: string, userId?: string, metadata?: Record<string, any>) => {
    // If user_id is not passed, attempt to grab from session or local storage, or default
    const actualUserId = userId || 'usr_seeded_developer';

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          user_id: actualUserId,
          metadata: metadata || {},
        }),
      });

      if (!res.ok) {
        console.warn(`Analytics track failed for event ${eventType}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`Failed to send analytics event ${eventType}:`, err);
    }
  },

  // Named helpers for all 21+ spec events to make wiring easy
  trackPageView: (userId?: string) => 
    analyticsService.track('templates_page_view', userId),
    
  trackCardHover: (templateId: string, userId?: string) => 
    analyticsService.track('template_hover', userId, { template_id: templateId }),

  trackTemplateOpen: (templateId: string, userId?: string) => 
    analyticsService.track('template_open', userId, { template_id: templateId }),

  trackUseTemplateClick: (templateId: string, userId?: string) => 
    analyticsService.track('use_template_click', userId, { template_id: templateId }),

  trackLoginPromptShown: (provider: string, userId?: string) => 
    analyticsService.track('login_prompt_shown', userId, { provider }),

  trackPlanGateShown: (plan: string, userId?: string) => 
    analyticsService.track('plan_gate_shown', userId, { required_plan: plan }),

  trackCloneStart: (cloneId: string, templateId: string, userId?: string) => 
    analyticsService.track('clone_start', userId, { clone_id: cloneId, template_id: templateId }),

  trackCloneSuccess: (cloneId: string, templateId: string, userId?: string) => 
    analyticsService.track('clone_success', userId, { clone_id: cloneId, template_id: templateId }),

  trackCloneError: (cloneId: string, templateId: string, error: string, userId?: string) => 
    analyticsService.track('clone_error', userId, { clone_id: cloneId, template_id: templateId, error }),

  trackWorkspaceCreated: (workspaceId: string, name: string, userId?: string) => 
    analyticsService.track('workspace_created', userId, { workspace_id: workspaceId, name }),

  trackAiCustomizeOpen: (sessionId: string, templateId: string, prompt: string, userId?: string) => 
    analyticsService.track('ai_customize_open', userId, { session_id: sessionId, template_id: templateId, prompt }),

  trackAiGenerate: (sessionId: string, prompt: string, userId?: string) => 
    analyticsService.track('ai_generate', userId, { session_id: sessionId, prompt }),

  trackAiApply: (appId: string, sessionId: string, patch: any, userId?: string) => 
    analyticsService.track('ai_apply', userId, { app_id: appId, session_id: sessionId, patch }),

  trackDeployStart: (deploymentId: string, appId: string, workspaceId: string, userId?: string) => 
    analyticsService.track('deploy_start', userId, { deployment_id: deploymentId, app_id: appId, workspace_id: workspaceId }),

  trackDeploySuccess: (deploymentId: string, appId: string, url: string, userId?: string) => 
    analyticsService.track('deploy_success', userId, { deployment_id: deploymentId, app_id: appId, url }),

  trackDeployError: (deploymentId: string, appId: string, error: string, userId?: string) => 
    analyticsService.track('deploy_error', userId, { deployment_id: deploymentId, app_id: appId, error }),

  trackDeployRollback: (deploymentId: string, appId: string, rollbackDeploymentId: string, userId?: string) => 
    analyticsService.track('deploy_rollback', userId, { deployment_id: deploymentId, app_id: appId, rollback_deployment_id: rollbackDeploymentId }),

  trackSearchSubmit: (query: string, resultCount: number, filters: any, userId?: string) => 
    analyticsService.track('search_submit', userId, { query, result_count: resultCount, filters }),

  trackShareTemplate: (templateId: string, shareUrl: string, userId?: string) => 
    analyticsService.track('share_template', userId, { template_id: templateId, share_url: shareUrl }),

  trackFavoriteTemplate: (templateId: string, isFav: boolean, userId?: string) => 
    analyticsService.track('favorite_template', userId, { template_id: templateId, is_favorite: isFav }),

  trackFilterApply: (filterType: 'category' | 'complexity' | 'sort' | 'tech_stack', value: string, userId?: string) => 
    analyticsService.track('filter_apply', userId, { filter_type: filterType, value }),

  trackCompareView: (templateIds: string[], userId?: string) => 
    analyticsService.track('compare_view', userId, { template_ids: templateIds }),
    
  trackErrorView: (code: string, message: string, userId?: string) =>
    analyticsService.track('error_view', userId, { error_code: code, error_message: message }),
};
