import React from 'react';

interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  const getColorClasses = (val: string) => {
    switch (val) {
      // Complexity
      case 'Simple':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/40 dark:border-teal-900/50';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/40 dark:border-amber-900/50';
      case 'Advanced':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/40 dark:border-rose-900/50';
      
      // Categories
      case 'CRM':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/40 dark:border-indigo-900/50';
      case 'HR':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-900/50';
      case 'Admin':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/40 dark:border-purple-900/50';
      case 'Analytics':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/40 dark:border-pink-900/50';
      case 'Inventory':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200/40 dark:border-orange-900/50';
      case 'Support':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/40 dark:border-sky-900/50';
        
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400 border border-gray-200/40 dark:border-gray-800/50';
    }
  };

  return (
    <span className={`text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full inline-flex items-center ${getColorClasses(label)}`}>
      {label}
    </span>
  );
}

export default Badge;
