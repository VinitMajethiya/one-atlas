import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { rateLimit, getRateLimitKey } from '@/lib/rateLimit';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await req.json().catch(() => ({}));
    const { workspace_id: workspaceId } = body;

    const template = await prisma.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Template not found' } },
        { status: 404 }
      );
    }

    const rawUserId = req.headers.get('x-user-id');
    const rateLimitKey = getRateLimitKey(req, rawUserId);
    if (!rateLimit(rateLimitKey, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
    const userId = rawUserId || 'anonymous-user';
    const jobId = `job_${crypto.randomBytes(8).toString('hex')}`;

    const clone = await prisma.clone.create({
      data: {
        userId,
        templateId,
        workspaceId: workspaceId || null,
        status: 'queued'
      }
    });

    await prisma.template.update({
      where: { id: templateId },
      data: { clone_count: { increment: 1 } }
    });

    await prisma.event.create({
      data: {
        eventType: 'clone_start',
        userId,
        metadata: {
          clone_id: clone.id,
          job_id: jobId,
          template_id: templateId,
          workspace_id: workspaceId || null
        }
      }
    }).catch(err => console.error('Failed to create clone_start event:', err));

    return NextResponse.json({
      clone_id: clone.id,
      job_id: jobId
    });

  } catch (error) {
    console.error('Error cloning template:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
