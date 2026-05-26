import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_seeded_developer';

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        template: true,
      },
    });

    return NextResponse.json(favorites.map((f: any) => f.template));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_seeded_developer';
    const { template_id } = await req.json();

    if (!template_id) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'template_id is required' } },
        { status: 400 }
      );
    }

    // Toggle favorite logic
    const existing = await prisma.favorite.findFirst({
      where: { userId, templateId: template_id },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, is_favorite: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          templateId: template_id,
        },
      });
      return NextResponse.json({ success: true, is_favorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
