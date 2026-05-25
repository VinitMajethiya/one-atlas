import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest) {
  try {
    const featured = await prisma.featuredCollection.findMany({
      where: {
        active: true,
        template: {
          status: 'published',
          visibility: true
        }
      },
      include: {
        template: true
      },
      orderBy: {
        position: 'asc'
      }
    });

    return NextResponse.json(featured, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' }
    });
  } catch (error) {
    console.error('Error fetching featured collection:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
