import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getRateLimitKey } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const { event_type: eventType, user_id: userId, metadata } = event;

    const rawUserId = userId || req.headers.get('x-user-id');
    const rateLimitKey = getRateLimitKey(req, rawUserId);
    if (!rateLimit(rateLimitKey, 100, 60 * 1000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    if (!eventType) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'event_type is required' } },
        { status: 400 }
      );
    }

    const dbEvent = await prisma.event.create({
      data: {
        eventType,
        userId: userId || null,
        metadata: metadata || {}
      }
    });

    const LOGGABLE_ACTIONS = [
      'clone_start', 'deploy_start', 'deploy_success', 'deploy_error',
      'deploy_rollback', 'ai_customize_open', 'ai_apply', 'share_template',
      'favorite_template', 'workspace_create'
    ];

    if (userId && LOGGABLE_ACTIONS.includes(eventType)) {
      await prisma.activityLog.create({
        data: {
          userId,
          templateId: metadata?.template_id || null,
          workspaceId: metadata?.workspace_id || null,
          action: eventType,
          metadata: metadata || {}
        }
      }).catch(err => console.error('Failed to write ActivityLog:', err));
    }

    function getNotificationTitle(type: string): string {
      switch (type) {
        case 'clone_success': return 'Workspace Cloned Successfully';
        case 'clone_error': return 'Workspace Cloning Failed';
        case 'deploy_success': return 'Application Deployed Successfully';
        case 'deploy_error': return 'Application Deployment Failed';
        case 'deploy_rollback': return 'Deployment Rolled Back';
        default: return 'System Alert';
      }
    }

    function getNotificationBody(type: string, meta: any): string {
      const templateName = meta?.template_name || 'blueprint';
      switch (type) {
        case 'clone_success': return `Your workspace for "${templateName}" has been successfully initialized.`;
        case 'clone_error': return `Failed to clone "${templateName}". Review your settings and try again.`;
        case 'deploy_success': return `Your custom "${templateName}" application is now live.`;
        case 'deploy_error': return `Deployment failed. Review logs for details.`;
        case 'deploy_rollback': return `Workspace rolled back to previous version ${meta?.rollback_deployment_id || ''}.`;
        default: return 'A system operation completed.';
      }
    }

    switch (eventType) {
      case 'search_submit':
        if (metadata?.query) {
          await prisma.searchLog.create({
            data: {
              query: metadata.query,
              userId: userId || null,
              resultCount: metadata.result_count || 0,
              filters: metadata.filters || {},
            }
          }).catch(err => console.error('Failed secondary search log write:', err));
        }
        break;

      case 'login_prompt_shown':
        await prisma.authAttempt.create({
          data: {
            userId: userId || null,
            provider: metadata?.provider || 'credentials',
            success: metadata?.success || false,
          }
        }).catch(err => console.error('Failed secondary auth attempt write:', err));
        break;

      case 'ai_customize_open':
        if (metadata?.template_id && metadata?.prompt) {
          await prisma.aiSession.create({
            data: {
              userId: userId || 'anonymous-user',
              templateId: metadata.template_id,
              prompt: metadata.prompt,
              context: metadata.context || {},
              styleTokens: metadata.style_tokens || {},
              schemaSnapshot: metadata.schema_snapshot || {},
              status: 'active',
            }
          }).catch(err => console.error('Failed secondary AI session write:', err));
        }
        break;

      case 'share_template':
        if (metadata?.template_id && metadata?.share_url) {
          await prisma.share.create({
            data: {
              userId: userId || 'anonymous-user',
              templateId: metadata.template_id,
              shareUrl: metadata.share_url,
            }
          }).catch(err => console.error('Failed secondary share write:', err));
        }
        break;

      case 'clone_start':
        if (metadata?.clone_id) {
          await prisma.clone.update({
            where: { id: metadata.clone_id },
            data: { status: 'running' }
          }).catch(err => console.error('Failed to update clone status:', err));
        }
        break;

      case 'deploy_start':
        if (metadata?.deployment_id) {
          await prisma.deployment.update({
            where: { id: metadata.deployment_id },
            data: { status: 'running' }
          }).catch(err => console.error('Failed to update deployment status:', err));
        }
        break;

      case 'deploy_rollback':
        if (metadata?.app_id && metadata?.workspace_id && metadata?.rollback_deployment_id) {
          await prisma.deployment.create({
            data: {
              appId: metadata.app_id,
              workspaceId: metadata.workspace_id,
              env: metadata.env || 'production',
              status: 'queued',
              rollbackDeploymentId: metadata.rollback_deployment_id,
              buildLog: ['Initiating rollback to deployment ' + metadata.rollback_deployment_id]
            }
          }).catch(err => console.error('Failed to create rollback deployment:', err));
        }
        break;

      case 'ai_apply':
        if (metadata?.app_id && metadata?.session_id && metadata?.patch) {
          await prisma.change.create({
            data: {
              appId: metadata.app_id,
              sessionId: metadata.session_id,
              patch: metadata.patch,
              rolledBack: false
            }
          }).catch(err => console.error('Failed secondary change write:', err));
          
          await prisma.schemaVersion.create({
            data: {
              appId: metadata.app_id,
              version: metadata.version || 1,
              content: metadata.changes || {},
            }
          }).catch(err => console.error('Failed secondary schemaVersion write:', err));
        }
        break;

      case 'favorite_template':
        if (userId && metadata?.template_id) {
          const existing = await prisma.favorite.findFirst({
            where: { userId, templateId: metadata.template_id }
          });
          if (existing) {
            await prisma.favorite.delete({ where: { id: existing.id } });
          } else {
            await prisma.favorite.create({
              data: { userId, templateId: metadata.template_id }
            });
          }
        }
        break;

      case 'compare_view':
        break;

      case 'filter_apply':
        break;
    }

    const NOTIFICATION_EVENTS = [
      'clone_success', 'clone_error', 'deploy_success', 'deploy_error', 'deploy_rollback'
    ];

    if (userId && NOTIFICATION_EVENTS.includes(eventType)) {
      await prisma.notification.create({
        data: {
          userId,
          type: eventType,
          title: getNotificationTitle(eventType),
          body: getNotificationBody(eventType, metadata),
          metadata: metadata || {},
        }
      }).catch(err => console.error('Failed to create notification:', err));
    }

    return NextResponse.json({ success: true, event_id: dbEvent.id });
  } catch (error) {
    console.error('Error handling event:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
