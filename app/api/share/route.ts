import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_seeded_developer';
    const { template_id } = await req.json();

    if (!template_id) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'template_id is required' } },
        { status: 400 }
      );
    }

    // Generate a unique share link
    const shareId = Math.random().toString(36).substring(2, 10);
    const shareUrl = `${req.nextUrl.origin}/preview/${shareId}`;

    const share = await prisma.share.create({
      data: {
        id: shareId,
        userId,
        templateId: template_id,
        shareUrl,
      },
    });

    // Fire event: share_template
    await fetch(`${req.nextUrl.origin}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'share_template',
        user_id: userId,
        metadata: { template_id, share_url: shareUrl }
      })
    }).catch(console.error);

    return NextResponse.json({ shareId: share.id, shareUrl: share.shareUrl });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
