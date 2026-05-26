import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapDbTemplateToFrontend } from '@/lib/theme';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category   = searchParams.get('category') ?? undefined;
  const complexity = searchParams.get('complexity') ?? undefined;
  const page       = parseInt(searchParams.get('page') ?? '1');
  const limit      = parseInt(searchParams.get('limit') ?? '12');

  const where = {
    status: 'published',
    visibility: true,
    ...(category   ? { category:   { equals: category,   mode: 'insensitive' as const } } : {}),
    ...(complexity ? { complexity: { equals: complexity, mode: 'insensitive' as const } } : {}),
  };

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.template.count({ where }),
  ]);

  const mappedTemplates = templates.map(mapDbTemplateToFrontend);

  return NextResponse.json({
    data: mappedTemplates,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
