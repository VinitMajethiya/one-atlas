import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const snapshot = await prisma.previewSnapshot.findUniqueOrThrow({
      where: { token },
    });
    return NextResponse.json({
      data: { schema: snapshot.schema, createdAt: snapshot.createdAt },
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Preview not found or token is invalid.' } },
      { status: 404 }
    );
  }
}
