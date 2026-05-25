import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    if (userId === 'anonymous-user') {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }

    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@oneatlas-user.internal`,
          name: 'Atlas Developer',
          role: 'user',
          plan: 'free',
          auth_provider: 'credentials',
          verified: true
        }
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Error in auth me route:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
