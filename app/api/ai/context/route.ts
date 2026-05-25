import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { template_id: templateId, prompt, context, style_tokens: styleTokens, schema_snapshot: schemaSnapshot } = body;

    if (!templateId || !prompt) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'template_id and prompt are required' } },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    const session = await prisma.aiSession.create({
      data: {
        userId,
        templateId,
        prompt,
        context: context || {},
        styleTokens: styleTokens || {},
        schemaSnapshot: schemaSnapshot || {},
        status: 'active'
      }
    });

    await prisma.event.create({
      data: {
        eventType: 'ai_customize_open',
        userId,
        metadata: {
          session_id: session.id,
          template_id: templateId,
          prompt
        }
      }
    }).catch((err: unknown) => console.error('Failed to create ai_customize_open event:', err));

    return NextResponse.json({ session_id: session.id });
  } catch (error) {
    console.error('Error creating AI session context:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
