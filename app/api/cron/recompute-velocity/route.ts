import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET environment variable not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Unauthorized cron trigger' } },
        { status: 401 }
      );
    }

    // Window defaults to 7 days
    const timeWindow = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Fetch clone counts per template in the last 7 days
    const templates = await prisma.template.findMany({
      select: { id: true },
    });

    for (const t of templates) {
      const cloneCountLastWeek = await prisma.clone.count({
        where: {
          templateId: t.id,
          createdAt: { gte: timeWindow },
        },
      });

      // Simple velocity formula: clones per day in the last 7 days
      const velocity = Number((cloneCountLastWeek / 7).toFixed(2));

      await prisma.template.update({
        where: { id: t.id },
        data: { usage_velocity: velocity },
      });
    }

    return NextResponse.json({ success: true, message: 'Velocity recomputed successfully' });
  } catch (error) {
    console.error('Error recomputing template usage velocity:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
