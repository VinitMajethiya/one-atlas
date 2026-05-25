import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mutations = await prisma.schemaMutation.findMany({
      where: { appId: id },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ data: mutations });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
