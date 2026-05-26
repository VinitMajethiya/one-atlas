import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, permissions, org_id: orgId, bootstrap_config: bootstrapConfig, app_id: appId } = body;

    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    const workspace = await prisma.workspace.create({
      data: {
        userId,
        name: name || 'My Workspace Blueprint',
        appId: appId || null,
        orgId: orgId || null,
        status: 'active',
        permissions: permissions || {},
        bootstrapConfig: bootstrapConfig || {}
      }
    });

    // Fire event
    await prisma.event.create({
      data: {
        eventType: 'workspace_created',
        userId,
        metadata: {
          workspace_id: workspace.id,
          name: workspace.name,
          org_id: orgId || null
        }
      }
    }).catch((err: unknown) => console.error('Failed to create workspace event:', err));

    return NextResponse.json({ workspace_id: workspace.id });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    if (userId === 'anonymous-user') {
      return NextResponse.json([]);
    }

    const workspaces = await prisma.workspace.findMany({
      where: { userId },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const result = workspaces.map((w: any) => ({
      workspace_id: w.id,
      name: w.name,
      status: w.status,
      app_id: w.appId,
      created_at: w.createdAt.toISOString(),
      deployment_url: w.deployments[0]?.url || null
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing workspaces:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
