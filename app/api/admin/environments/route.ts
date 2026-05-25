import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const environments = [
      { name: 'Developer Sandbox Partition', nodeType: 'm6g.medium', activeContainersCount: 14, cpuUsage: '14.2%', ramUsage: '2.4 GB / 8 GB', region: 'us-east-1', status: 'healthy' },
      { name: 'Staging Integration Cluster', nodeType: 'm6g.xlarge', activeContainersCount: 6, cpuUsage: '22.8%', ramUsage: '4.8 GB / 16 GB', region: 'us-east-1', status: 'healthy' },
      { name: 'Production Isolation Vault', nodeType: 'c6g.2xlarge', activeContainersCount: 22, cpuUsage: '48.1%', ramUsage: '12.2 GB / 32 GB', region: 'us-east-1', status: 'healthy' }
    ];

    return NextResponse.json(environments);
  } catch (error) {
    console.error('[admin/environments] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
