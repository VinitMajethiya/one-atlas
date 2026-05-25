import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const runtimeSchema = await prisma.runtimeSchema.findUniqueOrThrow({
      where: { appId: id },
    });

    const token = nanoid(12);

    const snapshot = await prisma.previewSnapshot.create({
      data: {
        appId: id,
        token,
        schema: runtimeSchema.content as any,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const previewUrl = `${appUrl}/preview/${token}`;

    return NextResponse.json({
      data: { previewUrl, token, createdAt: snapshot.createdAt },
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
