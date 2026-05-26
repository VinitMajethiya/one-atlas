import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id },
      select: { integrations: true }
    });

    if (!template) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Template not found' } },
        { status: 404 }
      );
    }

    const integrationMetadata: Record<string, { logo: string; description: string; type: string }> = {
      'Slack': { logo: 'Slack', description: 'Send channel alerts, webhook notifications, and daily summaries.', type: 'chat' },
      'Google Sheets': { logo: 'Spreadsheet', description: 'Auto-sync database records to dynamic cloud spreadsheets.', type: 'storage' },
      'Gmail': { logo: 'Mail', description: 'Send direct notifications, follow-up drip sequences, and verification templates.', type: 'email' },
      'BambooHR': { logo: 'Users', description: 'Sync payroll structures, profiles, and active leave balances.', type: 'hr' },
      'Bamboo HR': { logo: 'Users', description: 'Sync payroll structures, profiles, and active leave balances.', type: 'hr' },
      'Datadog': { logo: 'BarChart', description: 'Stream log levels, latency timelines, and feature errors.', type: 'monitoring' },
      'Logstash': { logo: 'Database', description: 'Forward logs to central Elasticsearch cluster pipelines.', type: 'logging' },
      'Stripe': { logo: 'CreditCard', description: 'Manage billing hooks, customer subscriptions, and checkout pages.', type: 'billing' },
      'Segment': { logo: 'RefreshCw', description: 'Forward user click telemetry to downstream CDPs.', type: 'analytics' },
      'Google Analytics': { logo: 'PieChart', description: 'Capture landing page statistics and session events.', type: 'analytics' },
      'Shopify': { logo: 'ShoppingBag', description: 'Sync product stocks, checkout lists, and order entries.', type: 'commerce' },
      'ShipStation': { logo: 'Truck', description: 'Print delivery labels and calculate carrier rates.', type: 'shipping' },
      'Zendesk': { logo: 'MessageSquare', description: 'Inject tickets, sync SLA timers, and import ticket streams.', type: 'helpdesk' },
      'Intercom': { logo: 'MessageCircle', description: 'Route user chats directly into support tables.', type: 'helpdesk' },
      'Facebook Ads': { logo: 'Facebook', description: 'Pull campaign cost tables and CTR timelines.', type: 'marketing' },
      'Google Ads': { logo: 'Activity', description: 'Track conversion codes and monthly budgets.', type: 'marketing' },
      'Mailchimp': { logo: 'MailOpen', description: 'Sync contact lists to marketing newsletters.', type: 'marketing' },
      'GitHub': { logo: 'Github', description: 'Link defection cards to active pull request branches.', type: 'devops' },
      'Jira': { logo: 'Layers', description: 'Map project sprints to incoming report queues.', type: 'devops' },
      'Sentry': { logo: 'ShieldAlert', description: 'Capture application stacktraces and debug triggers.', type: 'devops' },
      'Confluence': { logo: 'FileText', description: 'Sync article updates to external team resources.', type: 'admin' },
      'Notion': { logo: 'Clipboard', description: 'Embed wiki pages inside workspace directories.', type: 'admin' },
      'PayPal': { logo: 'CreditCard', description: 'Process global cart checkouts and invoice transactions.', type: 'billing' },
      'Xero': { logo: 'PieChart', description: 'Import subscription payouts to accounting registers.', type: 'finance' },
      'Zoom': { logo: 'Video', description: 'Create links for booked speaker meetings.', type: 'events' },
      'Google Calendar': { logo: 'Calendar', description: 'Block out schedules for summees and attendees.', type: 'events' },
      'Microsoft Intune': { logo: 'Monitor', description: 'Enforce hardware compliance policies.', type: 'security' },
      'Jamf': { logo: 'Smartphone', description: 'Verify employee mobile profiles and leases.', type: 'security' },
      'Hubspot': { logo: 'TrendingUp', description: 'Sync contact lead timelines and quota objectives.', type: 'crm' },
      'Lever': { logo: 'Briefcase', description: 'Pull candidate pipeline records into scorecards.', type: 'hr' },
      'Greenhouse': { logo: 'Briefcase', description: 'Import candidate applications and screen events.', type: 'hr' },
    };

    const details = (template.integrations || []).map((name: any) => {
      const meta = integrationMetadata[name] || { logo: 'Layers', description: 'Sync events and metadata properties.', type: 'custom' };
      return {
        name,
        ...meta
      };
    });

    return NextResponse.json({ integrations: details });
  } catch (error) {
    console.error('Error fetching template integrations:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
