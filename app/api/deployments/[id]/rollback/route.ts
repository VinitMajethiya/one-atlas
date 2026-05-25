import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id') || 'usr_seeded_developer';

    // Find the current deployment
    const deployment = await prisma.deployment.findUnique({
      where: { id },
    });

    if (!deployment) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Deployment not found' } },
        { status: 404 }
      );
    }

    const previousId = deployment.rollbackDeploymentId;
    if (!previousId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'No rollback version associated with this deployment' } },
        { status: 400 }
      );
    }

    // Find the previous deployment
    const previousDeployment = await prisma.deployment.findUnique({
      where: { id: previousId },
    });

    if (!previousDeployment) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Previous rollback deployment record not found' } },
        { status: 404 }
      );
    }

    // Create a new deployment referencing the rollback target
    const newDeployment = await prisma.deployment.create({
      data: {
        appId: deployment.appId,
        workspaceId: deployment.workspaceId,
        env: deployment.env,
        status: 'queued',
        rollbackDeploymentId: previousId,
        buildLog: [
          `Initiating rollback to deployment version ${previousId}...`,
          `Retrieving build artifact snapshot...`,
        ],
      },
    });

    // Update workspace status back to active (or deploying)
    await prisma.workspace.update({
      where: { id: deployment.workspaceId },
      data: { status: 'active' },
    });

    // Fire telemetry event: deploy_rollback
    await fetch(`${req.nextUrl.origin}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'deploy_rollback',
        user_id: userId,
        metadata: {
          deployment_id: newDeployment.id,
          app_id: deployment.appId,
          workspace_id: deployment.workspaceId,
          rollback_deployment_id: previousId,
        },
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      deployment_id: newDeployment.id,
      message: `Rollback initiated successfully. Target deployment: ${previousId}`,
    });
  } catch (error) {
    console.error('Error initiating deployment rollback:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
