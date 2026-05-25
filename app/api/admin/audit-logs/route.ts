import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        template: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching admin audit logs:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
