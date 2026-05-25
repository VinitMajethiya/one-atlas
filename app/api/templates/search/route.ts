import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const complexity = searchParams.get('complexity');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  const skip = (page - 1) * limit;

  let templates: any[] = [];
  let total = 0;

  try {
    if (q.trim()) {
      const searchPattern = q.trim();
      
      // Build conditions dynamically for raw sql safely
      const categoryFilter = category ? `AND category ILIKE $2` : '';
      const complexityFilter = complexity ? `AND complexity ILIKE ${category ? '$3' : '$2'}` : '';
      
      const queryParams: any[] = [searchPattern];
      if (category) queryParams.push(category);
      if (complexity) queryParams.push(complexity);

      // Raw query for Postgres Full Text Search using plainto_tsquery
      templates = await prisma.$queryRawUnsafe<any[]>(`
        SELECT * FROM "Template"
        WHERE to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' ')) @@ plainto_tsquery('english', $1)
          AND status = 'published'
          AND visibility = true
          ${categoryFilter}
          ${complexityFilter}
        ORDER BY ts_rank(to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' ')), plainto_tsquery('english', $1)) DESC
        LIMIT ${limit} OFFSET ${skip}
      `, ...queryParams);

      const totalRes = await prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as count FROM "Template"
        WHERE to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' ')) @@ plainto_tsquery('english', $1)
          AND status = 'published'
          AND visibility = true
          ${categoryFilter}
          ${complexityFilter}
      `, ...queryParams);

      total = totalRes[0]?.count || 0;
    } else {
      const where = {
        status: 'published',
        visibility: true,
        ...(category ? { category: { equals: category, mode: 'insensitive' as const } } : {}),
        ...(complexity ? { complexity: { equals: complexity, mode: 'insensitive' as const } } : {}),
      };

      [templates, total] = await Promise.all([
        prisma.template.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.template.count({ where }),
      ]);
    }

    // Attempt to log search query
    const userId = req.headers.get('x-user-id') || null;
    await prisma.searchLog.create({
      data: {
        query: q,
        userId,
        resultCount: total,
        filters: { category: category || null, complexity: complexity || null }
      }
    }).catch((err: unknown) => console.error('Failed to log search log:', err));

    // Create Search event
    await prisma.event.create({
      data: {
        eventType: 'search_submit',
        userId,
        metadata: { query: q, result_count: total, filters: { category, complexity } }
      }
    }).catch((err: unknown) => console.error('Failed to create search event:', err));

  } catch (error) {
    console.error('Search error:', error);
    // Fallback to simple database search if raw query fails (e.g. database not postgres or FTS index missing)
    const where = {
      status: 'published',
      visibility: true,
      ...(category ? { category: { equals: category, mode: 'insensitive' as const } } : {}),
      ...(complexity ? { complexity: { equals: complexity, mode: 'insensitive' as const } } : {}),
      ...(q.trim() ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { description: { contains: q, mode: 'insensitive' as const } },
        ]
      } : {})
    };

    [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.template.count({ where }),
    ]);
  }

  return NextResponse.json({
    data: templates,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
}
