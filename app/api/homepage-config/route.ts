import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    return NextResponse.json({
      hero: {
        title: 'Accelerate Your App Development with OneAtlas',
        subtitle: 'Instantly clone premium blueprints, customize with generative AI, and deploy to your secure runtime isolation in seconds.',
        cta: {
          text: 'Browse Blueprints',
          link: '/templates'
        }
      },
      features: [
        { title: 'AI-Enhanced Customization', description: 'Modify database schemas and logic trees using natural language instructions.' },
        { title: 'Zero-Ops Deployment', description: 'Automatic sandboxing, Docker provisioning, and live domain deployments.' },
        { title: 'Comprehensive Analytics', description: 'Track every user action and system metric through built-in telemetry.' }
      ]
    });
  } catch (error) {
    console.error('[homepage-config] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
