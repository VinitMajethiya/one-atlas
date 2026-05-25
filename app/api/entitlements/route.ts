import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    let user = null;
    if (userId !== 'anonymous-user') {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    const plan = user?.plan || 'free';

    const entitlements = {
      plan,
      canClonePro: plan === 'pro' || plan === 'enterprise',
      canCloneEnterprise: plan === 'enterprise',
      maxWorkspaces: plan === 'enterprise' ? 100 : plan === 'pro' ? 10 : 3,
      aiCustomizationLimit: plan === 'enterprise' ? 1000 : plan === 'pro' ? 100 : 5,
      deploymentAllowed: true,
      realtimeSyncAllowed: plan === 'pro' || plan === 'enterprise',
    };

    return NextResponse.json(entitlements);
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
