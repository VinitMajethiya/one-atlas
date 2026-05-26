/**
 * OneAtlas design system — shared Tailwind class tokens.
 * Colors are defined in app/globals.css (@theme inline).
 */

export const ALERT_ERROR =
  'bg-bg-default text-primary border border-border-default p-4 rounded-[var(--radius-sm)] text-xs font-bold leading-relaxed';

export const ALERT_SUCCESS =
  'bg-bg-default text-primary border border-border-default p-4 rounded-[var(--radius-sm)] text-xs font-bold text-center';

export const STATUS_PILL = {
  default: 'bg-bg-default text-text-body border-border-default',
  success: 'bg-bg-default text-primary border-border-default',
  warning: 'bg-bg-default text-text-muted border-border-default',
  danger: 'bg-bg-default text-primary border-border-default',
} as const;

/** Lucide icon name → text color class */
export const TEMPLATE_ICON_CLASS: Record<string, string> = {
  BookOpen: 'text-primary',
  LifeBuoy: 'text-text-muted',
  Bookmark: 'text-primary',
  Bell: 'text-primary',
  Video: 'text-primary',
  Briefcase: 'text-primary',
  Users: 'text-primary',
  Sliders: 'text-text-muted',
  BarChart2: 'text-primary',
  Package: 'text-primary',
  HelpCircle: 'text-text-muted',
  Zap: 'text-primary',
  CheckSquare: 'text-primary',
  Terminal: 'text-text-muted',
  GitMerge: 'text-primary',
  FileText: 'text-text-muted',
  Code: 'text-primary',
  Layers: 'text-primary',
  Activity: 'text-primary',
  DollarSign: 'text-primary',
  Heart: 'text-primary',
  ShoppingBag: 'text-primary',
  Cloud: 'text-text-muted',
};

export function templateIconClass(iconName?: string): string {
  return TEMPLATE_ICON_CLASS[iconName ?? ''] ?? 'text-primary';
}

/** Template card accent key → hover border (literal hex to avoid CSS variable opacity issues) */
export const TEMPLATE_BORDER_HOVER: Record<string, string> = {
  indigo: 'hover:border-[#FFB380]',
  teal: 'hover:border-[#FFB380]',
  amber: 'hover:border-[#FFB380]',
  rose: 'hover:border-[#FFB380]',
  orange: 'hover:border-[#FFB380]',
  sky: 'hover:border-[#FFB380]',
};

export function templateBorderHover(color: string): string {
  return TEMPLATE_BORDER_HOVER[color] ?? 'hover:border-[#FFB380]';
}

export const BUILDER_NODE_ICON_CLASS: Record<string, string> = {
  layout: 'text-primary',
  table: 'text-text-muted',
  kanban: 'text-text-muted',
  chart: 'text-primary',
  form: 'text-primary',
  nav: 'text-text-muted',
};

export function builderNodeIconClass(type: string): string {
  return BUILDER_NODE_ICON_CLASS[type] ?? 'text-primary';
}

/** Quick-start template chip styles on /generate */
export const QUICK_TEMPLATE_CHIP: Record<string, string> = {
  'crm-workspace':
    'border-border-default text-primary hover:bg-[#ECEEE7]',
  'hr-dashboard':
    'border-border-default text-primary hover:bg-[#ECEEE7]',
  'admin-panel':
    'border-border-default text-primary hover:bg-[#ECEEE7]',
};

export const BADGE_CLASSES: Record<string, string> = {
  Simple: 'bg-bg-default text-text-body border border-border-default',
  Moderate: 'bg-bg-default text-text-body border border-border-default',
  Advanced: 'bg-[#FFF0E6] text-primary border border-[#FFD6B3]',
  CRM: 'bg-bg-default text-text-body border border-border-default',
  HR: 'bg-bg-default text-text-body border border-border-default',
  Admin: 'bg-bg-default text-text-body border border-border-default',
  Analytics: 'bg-[#FFF0E6] text-primary border border-[#FFD6B3]',
  Inventory: 'bg-[#FFF0E6] text-primary border border-[#FFD6B3]',
  Support: 'bg-bg-default text-text-body border border-border-default',
};

export function badgeClasses(label: string): string {
  return (
    BADGE_CLASSES[label] ??
    'bg-bg-default text-text-muted border border-border-default'
  );
}

export function mapDbTemplateToFrontend(dbTemplate: any): any {
  if (!dbTemplate) return null;
  return {
    ...dbTemplate,
    authorVerified: dbTemplate.authorVerified ?? dbTemplate.author_verified ?? false,
    priceType: dbTemplate.priceType ?? dbTemplate.price_type ?? 'free',
    priceAmount: dbTemplate.priceAmount ?? dbTemplate.price_amount ?? 0,
    cloneCount: dbTemplate.cloneCount ?? dbTemplate.clone_count ?? 0,
    usageVelocity: dbTemplate.usageVelocity ?? dbTemplate.usage_velocity ?? 0,
    aiReady: dbTemplate.aiReady ?? dbTemplate.ai_ready ?? false,
    backendEnabled: dbTemplate.backendEnabled ?? dbTemplate.backend_enabled ?? false,
    realtimeEnabled: dbTemplate.realtimeEnabled ?? dbTemplate.realtime_enabled ?? false,
    deploymentReady: dbTemplate.deploymentReady ?? dbTemplate.deployment_ready ?? false,
    permissionsRequired: dbTemplate.permissionsRequired ?? dbTemplate.permissions_required ?? [],
    healthScore: dbTemplate.healthScore ?? dbTemplate.health_score ?? 0,
    longDescription: dbTemplate.longDescription ?? dbTemplate.long_description ?? dbTemplate.description ?? '',
  };
}

export function mapFeaturedToFrontend(feat: any): any {
  if (!feat) return null;
  return {
    ...feat,
    template: mapDbTemplateToFrontend(feat.template)
  };
}
