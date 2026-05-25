import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Email and password (min 8 chars) are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? email.split('@')[0],
        role: 'user',
        plan: 'free',
        verified: false,
        passwordHash,
      }
    });

    return NextResponse.json({ 
      id: user.id, 
      email: user.email 
    }, { status: 201 });

  } catch (error) {
    console.error('[auth/register]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
