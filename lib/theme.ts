/**
 * Home Atlas design system — shared Tailwind class tokens.
 * Colors are defined in app/globals.css (@theme inline).
 */

export const ALERT_ERROR =
  'bg-tint-pink text-accent-pink border border-accent-pink/25 dark:border-accent-pink/30 p-4 rounded-xl text-xs font-bold leading-relaxed';

export const ALERT_SUCCESS =
  'bg-tint-teal text-accent-green border border-accent-teal/25 p-4 rounded-xl text-xs font-bold text-center';

export const STATUS_PILL = {
  default: 'bg-bg-muted text-text-body border-border-default',
  success:
    'bg-tint-teal text-accent-green border-accent-teal/30 dark:text-accent-teal',
  warning:
    'bg-tint-yellow text-dark-navy border-accent-yellow/40 dark:text-accent-yellow',
  danger:
    'bg-tint-pink text-accent-pink border-accent-pink/30 dark:text-accent-pink',
} as const;

/** Lucide icon name → text color class */
export const TEMPLATE_ICON_CLASS: Record<string, string> = {
  BookOpen: 'text-primary',
  LifeBuoy: 'text-accent-pink',
  Bookmark: 'text-accent-orange',
  Bell: 'text-accent-teal',
  Video: 'text-accent-blue',
  Briefcase: 'text-primary',
  Users: 'text-accent-green',
  Sliders: 'text-accent-yellow',
  BarChart2: 'text-accent-pink',
  Package: 'text-accent-orange',
  HelpCircle: 'text-accent-cyan',
  Zap: 'text-accent-yellow',
  CheckSquare: 'text-accent-green',
  Terminal: 'text-text-muted',
  GitMerge: 'text-primary-light',
  FileText: 'text-accent-blue',
  Code: 'text-primary',
  Layers: 'text-accent-pink',
  Activity: 'text-accent-teal',
  DollarSign: 'text-accent-green',
  Heart: 'text-accent-pink',
  ShoppingBag: 'text-accent-orange',
  Cloud: 'text-accent-cyan',
};

export function templateIconClass(iconName?: string): string {
  return TEMPLATE_ICON_CLASS[iconName ?? ''] ?? 'text-primary';
}

/** Template card accent key → hover border */
export const TEMPLATE_BORDER_HOVER: Record<string, string> = {
  indigo: 'hover:border-primary/30',
  teal: 'hover:border-accent-teal/30',
  amber: 'hover:border-accent-yellow/30',
  rose: 'hover:border-accent-pink/30',
  orange: 'hover:border-accent-orange/30',
  sky: 'hover:border-accent-cyan/30',
};

export function templateBorderHover(color: string): string {
  return TEMPLATE_BORDER_HOVER[color] ?? 'hover:border-primary/30';
}

export const BUILDER_NODE_ICON_CLASS: Record<string, string> = {
  layout: 'text-primary',
  table: 'text-accent-teal',
  kanban: 'text-accent-yellow',
  chart: 'text-accent-pink',
  form: 'text-accent-orange',
  nav: 'text-accent-cyan',
};

export function builderNodeIconClass(type: string): string {
  return BUILDER_NODE_ICON_CLASS[type] ?? 'text-primary';
}

/** Quick-start template chip styles on /generate */
export const QUICK_TEMPLATE_CHIP: Record<string, string> = {
  'crm-workspace':
    'border-primary/30 text-primary hover:bg-primary/5',
  'hr-dashboard':
    'border-accent-teal/30 text-accent-teal hover:bg-accent-teal/5',
  'admin-panel':
    'border-primary-light/30 text-primary-light hover:bg-primary-light/5',
};

export const BADGE_CLASSES: Record<string, string> = {
  Simple: 'bg-tint-teal text-accent-green border border-accent-teal/25',
  Moderate: 'bg-tint-yellow text-dark-navy border border-accent-yellow/30',
  Advanced: 'bg-tint-pink text-accent-pink border border-accent-pink/25',
  CRM: 'bg-accent-lavender text-primary border border-primary/20',
  HR: 'bg-tint-teal text-accent-green border border-accent-teal/25',
  Admin: 'bg-accent-lavender text-dark-navy border border-border-default',
  Analytics: 'bg-tint-pink text-accent-pink border border-accent-pink/25',
  Inventory: 'bg-tint-orange text-accent-orange border border-accent-orange/25',
  Support: 'bg-bg-subtle text-accent-cyan border border-accent-cyan/25',
};

export function badgeClasses(label: string): string {
  return (
    BADGE_CLASSES[label] ??
    'bg-bg-muted text-text-muted border border-border-default'
  );
}
