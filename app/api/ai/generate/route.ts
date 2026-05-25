import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { session_id: sessionId, prompt: userPrompt } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'session_id is required' } },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    const session = await prisma.aiSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'AI session not found' } },
        { status: 404 }
      );
    }

    // Update session status to generating
    await prisma.aiSession.update({
      where: { id: sessionId },
      data: { status: 'generating' }
    });

    // Mock app creation or retrieval for mock flow completion
    let app = await prisma.app.findFirst({
      where: { userId }
    });

    if (!app) {
      app = await prisma.app.create({
        data: {
          name: 'Custom Application',
          userId,
          templateId: session.templateId,
          schema: {},
        }
      });
    }

    // Create a Change record
    const change = await prisma.change.create({
      data: {
        appId: app.id,
        sessionId,
        patch: {
          addedComponents: ['AiSummaryPanel'],
          modifiedFields: {
            'contacts-table': [
              { id: 'f_ai_1', name: 'notes', type: 'text', label: 'AI Generated Notes', required: false, visible: true }
            ]
          }
        },
        rolledBack: false
      }
    });

    // Create SchemaVersion record
    await prisma.schemaVersion.create({
      data: {
        appId: app.id,
        version: app.currentVersion + 1,
        content: {
          appName: app.name,
          modifiedAt: new Date().toISOString(),
          prompt: userPrompt || session.prompt
        }
      }
    });

    // Fire ai_generate event
    await prisma.event.create({
      data: {
        eventType: 'ai_generate',
        userId,
        metadata: {
          session_id: sessionId,
          change_id: change.id,
          prompt: userPrompt || session.prompt
        }
      }
    }).catch((err: unknown) => console.error('Failed to create ai_generate event:', err));

    return NextResponse.json({
      success: true,
      change_id: change.id,
      patch: change.patch,
      message: 'AI code generation completed successfully.'
    });

  } catch (error) {
    console.error('Error generating AI changes:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
