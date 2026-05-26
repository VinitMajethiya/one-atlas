import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get('ids') || '';
    const ids = idsString.split(',').filter((id: string) => id.trim() !== '');

    if (ids.length === 0) {
      return NextResponse.json([]);
    }

    const templates = await prisma.template.findMany({
      where: {
        id: { in: ids },
      },
    });

    // Fire telemetry event: compare_view
    await fetch(`${req.nextUrl.origin}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'compare_view',
        user_id: 'usr_seeded_developer',
        metadata: { template_ids: ids }
      })
    }).catch(console.error);

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching compare templates:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
