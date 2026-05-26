import React from 'react';
import { badgeClasses } from '@/lib/theme';

interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  return (
    <span
      className={`text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-[var(--radius-sm)] inline-flex items-center ${badgeClasses(label)}`}
    >
      {label}
    </span>
  );
}

export default Badge;
