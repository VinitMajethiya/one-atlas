import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ suggestions: [] }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' }
    });
  }

  try {
    // Return top 8 templates based on title or tags containing the query
    const templates = await prisma.template.findMany({
      where: {
        status: 'published',
        visibility: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: [q.toLowerCase()] } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        tags: true
      },
      take: 8
    });

    const suggestions = templates.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      category: t.category,
      tags: t.tags
    }));

    return NextResponse.json({ suggestions }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' }
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
