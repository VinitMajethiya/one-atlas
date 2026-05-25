import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        app: true,
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!workspace) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Workspace not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        status: workspace.status,
        org_id: workspace.orgId,
        owner: workspace.userId,
        permissions: workspace.permissions,
        created_at: workspace.createdAt.toISOString()
      },
      deployment: workspace.deployments[0] ? {
        id: workspace.deployments[0].id,
        status: workspace.deployments[0].status,
        url: workspace.deployments[0].url,
        env: workspace.deployments[0].env,
        build_log: workspace.deployments[0].buildLog,
        created_at: workspace.deployments[0].createdAt.toISOString()
      } : null,
      app: workspace.app ? {
        id: workspace.app.id,
        name: workspace.app.name,
        current_version: workspace.app.currentVersion
      } : null
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
