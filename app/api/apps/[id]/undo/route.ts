import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rollbackToVersion } from '@/lib/services/schemaService';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = await prisma.app.findUniqueOrThrow({ where: { id } });

    if (app.currentVersion <= 1) {
      return NextResponse.json(
        { error: { code: 'NO_HISTORY', message: 'Already at the initial version.' } },
        { status: 400 }
      );
    }

    const result = await rollbackToVersion(id, app.currentVersion - 1);
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
