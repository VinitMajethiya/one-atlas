import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let deployment = await prisma.deployment.findUnique({
      where: { id }
    });

    if (!deployment) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Deployment not found' } },
        { status: 404 }
      );
    }

    // Mock progress simulation based on elapsed time since creation
    const elapsedMs = Date.now() - new Date(deployment.createdAt).getTime();
    let currentStatus = deployment.status;
    let logs = [...deployment.buildLog];
    let url = deployment.url;

    if (currentStatus === 'queued' && elapsedMs > 2000) {
      currentStatus = 'running';
      logs = [
        ...logs,
        'Validating container environment configurations...',
        'Bootstrapping workspace environment database...',
        'Injecting custom theme tokens and schemas...',
      ];
      
      // Update DB to "running"
      deployment = await prisma.deployment.update({
        where: { id },
        data: {
          status: 'running',
          buildLog: logs
        }
      });
    }

    if (currentStatus === 'running' && elapsedMs > 7000) {
      currentStatus = 'success';
      url = `https://sandbox-${deployment.appId}.oneatlas.dev`;
      logs = [
        ...logs,
        'Building static pages and bundles...',
        'Running structural validation tests...',
        'Asset optimization complete.',
        `Deployment successful! App live at: ${url}`,
      ];

      // Update DB to "success"
      deployment = await prisma.deployment.update({
        where: { id },
        data: {
          status: 'success',
          buildLog: logs,
          url
        }
      });

      // Fire deploy_success event
      await fetch(`${req.nextUrl.origin}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'deploy_success',
          user_id: 'usr_seeded_developer',
          metadata: {
            deployment_id: deployment.id,
            app_id: deployment.appId,
            url
          }
        })
      }).catch(console.error);
    }

    return NextResponse.json({
      id: deployment.id,
      status: currentStatus,
      build_log: logs,
      url: url,
      rollback_deployment_id: deployment.rollbackDeploymentId
    });
  } catch (error) {
    console.error('Error fetching deployment:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
