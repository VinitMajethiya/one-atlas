import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const window = searchParams.get('window') || '7d';

    let days = 7;
    if (window === '24h') days = 1;
    if (window === '30d') days = 30;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // Fetch top 5 templates ordered by usage_velocity and clone_count
    const templates = await prisma.template.findMany({
      where: {
        status: 'published',
        visibility: true
      },
      orderBy: [
        { usage_velocity: 'desc' },
        { clone_count: 'desc' }
      ],
      take: 5
    });

    return NextResponse.json(templates, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' }
    });
  } catch (error) {
    console.error('Error fetching trending templates:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
