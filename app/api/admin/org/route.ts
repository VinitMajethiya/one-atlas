import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    // Return organization settings boundaries
    const orgConfig = {
      id: 'org_oneatlas_enterprise',
      name: 'Home Atlas Enterprises',
      tier: 'enterprise',
      limits: {
        maxUsers: 500,
        activeUsersCount: 42,
        sandboxesAllowed: 50,
        activeSandboxesCount: 14,
        aiGenerationsLimit: 'unlimited',
      },
      security: {
        ssoEnabled: true,
        mfaRequired: true,
        encryptionAtRest: true,
        logRetentionDays: 365,
      }
    };

    return NextResponse.json(orgConfig);
  } catch (error) {
    console.error('[admin/org] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
