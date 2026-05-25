import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const policyEngine = {
      policies: [
        { id: 'pol_1', name: 'Disable Raw SQL Execution', description: 'Prevent AI generators from applying direct raw sql edits without validation', enabled: true, severity: 'block' },
        { id: 'pol_2', name: 'Enforce Regional VPC Sandbox', description: 'Limit app database containers hosting partitions to region eu-west-1', enabled: true, severity: 'warning' },
        { id: 'pol_3', name: 'Restrict OAuth Domains', description: 'Only accept workspace logins from corporate whitelisted email subdomains', enabled: true, severity: 'block' },
        { id: 'pol_4', name: 'Force Quality Validation check', description: 'Require quality score > 90% before allowing workspace promotion to staging', enabled: false, severity: 'block' },
      ]
    };

    return NextResponse.json(policyEngine);
  } catch (error) {
    console.error('[admin/policies] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
