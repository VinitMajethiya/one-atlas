import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapDbTemplateToFrontend } from '@/lib/theme';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Template not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(mapDbTemplateToFrontend(template));
  } catch (error) {
    console.error('Error fetching template detail:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
