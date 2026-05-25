import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const share = await prisma.share.findUnique({
      where: { id },
      include: {
        template: true,
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Share link not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(share);
  } catch (error) {
    console.error('Error fetching share record:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
