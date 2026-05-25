import { NextRequest, NextResponse } from 'next/server';
import { getAppWithSchema } from '@/lib/services/schemaService';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = await getAppWithSchema(id);
    return NextResponse.json({ data: app });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
