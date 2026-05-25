import { NavItem } from '../types/nav';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Product',
    megaMenu: [
      {
        heading: 'Explore Product',
        items: [
          { label: 'Schema Editor', href: '#', description: 'Modify operational apps via live visual schemas.', icon: 'Sliders' },
          { label: 'Instant Deploy', href: '#', description: 'Go live on secure, scalable cloud endpoints in seconds.', icon: 'Zap' },
          { label: 'Auto Forms', href: '#', description: 'Automatically generate input panels with validations.', icon: 'CheckSquare' },
          { label: 'Interactive Charts', href: '#', description: 'Digest key business performance indicators dynamically.', icon: 'BarChart2' },
        ],
      },
      {
        heading: 'Popular Tools',
        items: [
          { label: 'Atlas CLI', href: '#', description: 'Sync and version-control schemas from your local terminal.', icon: 'Terminal' },
          { label: 'Integrations', href: '#', description: 'Connect with Postgres, Slack, Stripe, and Salesforce.', icon: 'GitMerge' },
          { label: 'Audit Logs', href: '#', description: 'Track configuration revisions and access controls.', icon: 'FileText' },
        ],
      },
      {
        heading: 'Spotlight',
        items: [
          { label: 'OneAtlas Live Sandbox', href: '/generate', description: 'Build and test visual schemas in real-time.', badge: 'NEW' },
          { label: 'Enterprise Security Audit', href: '/security', description: 'Learn about SOC 2 and customer-managed KMS vault setups.', badge: 'HOT' },
        ],
      },
    ],
  },
  {
    label: 'Use Cases',
    megaMenu: [
      {
        heading: 'By Role',
        items: [
          { label: 'Developers', href: '#', description: 'Generate internal tools without wasting hours on CSS boilerplate.', icon: 'Code' },
          { label: 'Product Managers', href: '#', description: 'Prototype operational workflows and gather rapid feedback.', icon: 'Layers' },
          { label: 'Operations Staff', href: '#', description: 'Build customized support desks and inventory queues.', icon: 'Activity' },
          { label: 'HR Managers', href: '#', description: 'Manage employee directories and coordinate leave policies.', icon: 'Users' },
        ],
      },
      {
        heading: 'By Industry',
        items: [
          { label: 'Fintech', href: '#', description: 'Transaction tables, compliance audits, and billing portals.', icon: 'DollarSign' },
          { label: 'Healthcare', href: '#', description: 'Secure directories, resource checkers, and SLA desks.', icon: 'Heart' },
          { label: 'E-commerce', href: '#', description: 'Warehouse stock trackers, shipping logs, and vendor charts.', icon: 'ShoppingBag' },
          { label: 'SaaS Operations', href: '#', description: 'Usage logs, customer analytics, and feature flag management.', icon: 'Cloud' },
        ],
      },
    ],
  },
  {
    label: 'Templates',
    // Special handling in Navbar component to render the 3-column template list from template.ts
  },
  {
    label: 'Enterprise',
    href: '/enterprise',
  },
  {
    label: 'Security',
    href: '/security',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Docs', href: '/docs', description: 'Developer guides, concept sheets, and API specs.', icon: 'BookOpen' },
      { label: 'Help Center', href: '/support', description: 'Search articles or contact customer support.', icon: 'LifeBuoy' },
      { label: 'Blog', href: '/blog', description: 'Company updates, design advice, and customer stories.', icon: 'Bookmark' },
      { label: 'Updates', href: '/docs', description: 'See what is new in version 2.4 of the schema editor.', icon: 'Bell' },
      { label: 'YouTube', href: 'https://youtube.com/@oneatlas', description: 'Watch building tutorials on our YouTube channel.', icon: 'Video' },
    ],
  },
  {
    label: 'Community',
    dropdown: [
      { label: 'Discord', href: 'https://discord.gg/mock-oneatlas', description: 'Chat with other internal tool developers.' },
      { label: 'GitHub', href: 'https://github.com/mock-oneatlas', description: 'Browse open-source code and star us.' },
      { label: 'Twitter/X', href: 'https://x.com/mock-oneatlas', description: 'Follow our release announcements.' },
      { label: 'LinkedIn', href: 'https://linkedin.com/mock-oneatlas', description: 'Check out corporate news.' },
      { label: 'Reddit', href: 'https://reddit.com/r/mock-oneatlas', description: 'Join community discussions.' },
      { label: 'Instagram', href: 'https://instagram.com/oneatlas', description: 'Behind-the-scenes builds and product shots.' },
    ],
  },
];
