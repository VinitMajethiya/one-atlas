import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const ssoConfig = {
      provider: 'Okta Enterprise Identity',
      metadataUrl: 'https://okta.oneatlas-corp.com/app/exk...',
      clientId: '0oae938kd93a8d9aK5d7',
      authEndpoint: 'https://okta.oneatlas-corp.com/oauth2/v1/authorize',
      tokenEndpoint: 'https://okta.oneatlas-corp.com/oauth2/v1/token',
      domainsWhitelisted: ['oneatlas-corp.com', 'oneatlas.live'],
      status: 'connected',
    };

    return NextResponse.json(ssoConfig);
  } catch (error) {
    console.error('[admin/sso] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
