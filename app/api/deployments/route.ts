import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { app_id: appId, workspace_id: workspaceId, env } = body;

    if (!appId || !workspaceId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'app_id and workspace_id are required' } },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id') || 'anonymous-user';
    const jobId = `job_${crypto.randomBytes(8).toString('hex')}`;

    const deployment = await prisma.deployment.create({
      data: {
        appId,
        workspaceId,
        env: env || 'production',
        status: 'queued',
        buildLog: ['Initializing deployment pipeline...', 'Pulling template artifacts...']
      }
    });

    await prisma.event.create({
      data: {
        eventType: 'deploy_start',
        userId,
        metadata: {
          deployment_id: deployment.id,
          job_id: jobId,
          app_id: appId,
          workspace_id: workspaceId
        }
      }
    }).catch((err: unknown) => console.error('Failed to create deploy_start event:', err));

    return NextResponse.json({
      deployment_id: deployment.id,
      job_id: jobId
    });

  } catch (error) {
    console.error('Error creating deployment:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
