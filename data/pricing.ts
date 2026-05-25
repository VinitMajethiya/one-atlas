export interface PricingTier {
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'Perfect for developers exploring and prototyping internal tools.',
    features: [
      'Up to 3 active applications',
      'All category templates (CRM, HR, etc.)',
      'Standard model generation (Claude 3.5 Sonnet)',
      'Community forum support',
      'Public read-only previews',
    ],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Pro',
    priceMonthly: 29,
    priceAnnually: 24,
    description: 'Best for growing startups and professional team builders.',
    features: [
      'Unlimited generated apps',
      'Advanced complexity templates included',
      'Access to latest premium models (GPT-4o, Gemini 1.5 Pro)',
      'Custom domains with SSL',
      'Priority email support (under 4 hours)',
      'Team workspace collaboration (up to 5 editors)',
    ],
    cta: 'Get Started with Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: 9999, // Represents Custom
    priceAnnually: 9999,
    description: 'Security, compliance, and custom integration for large operations.',
    features: [
      'Dedicated tenant isolation',
      'SAML Single Sign-On (SSO)',
      'Role-Based Access Control (RBAC)',
      'Continuous audit logging logs',
      '99.9% SLA uptime guarantee',
      'Dedicated success manager & Slack channel',
    ],
    cta: 'Talk to Sales',
    popular: false,
  },
];

export const FEATURE_COMPARISON = [
  { feature: 'Active Generated Applications', free: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Premium AI Templates', free: 'Basic Category Only', pro: 'All Templates Included', enterprise: 'Custom Templates' },
  { feature: 'Model Selection', free: 'Claude Sonnet', pro: 'All (GPT-4o, Claude, Gemini)', enterprise: 'Dedicated Model Hub' },
  { feature: 'Custom Domains', free: '✘', pro: '✔', enterprise: '✔' },
  { feature: 'Single Sign-On (SSO)', free: '✘', pro: '✘', enterprise: 'SAML / OIDC' },
  { feature: 'Role-Based Access Control (RBAC)', free: '✘', pro: '✘', enterprise: 'Custom Roles & API' },
  { feature: 'Audit Logs', free: '✘', pro: '✘', enterprise: '✔ (Immutable)' },
  { feature: 'Database Support', free: 'Mock Store', pro: 'Postgres, MySQL, DynamoDB', enterprise: 'On-premise / VPC tunnel' },
  { feature: 'SLA Uptime', free: 'Best Effort', pro: '99.5%', enterprise: '99.99%' },
  { feature: 'Support SLA', free: 'Community', pro: 'Priority Email', enterprise: '24/7 Phone & Slack' },
];
