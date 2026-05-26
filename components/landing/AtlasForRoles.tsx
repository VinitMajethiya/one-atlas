import React from 'react';
import Link from 'next/link';
import { Code, Layers, ShieldCheck, Heart, Users, DollarSign, ArrowRight } from 'lucide-react';

export function AtlasForRoles() {
  const roles = [
    {
      role: 'Developers',
      description: 'Ship internal dashboards without styling boilerplate or grid coordinates. Bind directly to REST endpoints, Postgres databases, or Snowflake warehouses.',
      builds: 'Admin tools, system panels, log viewers, API keys dashboards.',
      icon: <Code className="h-5 w-5 text-primary" />,
      href: '/templates?category=developers',
    },
    {
      role: 'Product Managers',
      description: 'Prototype complex multi-step user flows, coordinate mock data variables, and validate interface ideas before committing core sprint timelines.',
      builds: 'Interactive wireframes, analytics boards, feature release checklists.',
      icon: <Layers className="h-5 w-5 text-primary" />,
      href: '/templates?category=product-managers',
    },
    {
      role: 'Operations Teams',
      description: 'Automate physical warehouse supply tracking, catalog inventory changes, and trigger logistics flows using clean, form-based interfaces.',
      builds: 'Stock controllers, delivery trackers, purchase orders dashboards.',
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      href: '/templates?category=operations-teams',
    },
    {
      role: 'HR Managers',
      description: 'Coordinate employee onboarding check-lists, track department vacation applications, and manage global team directories securely.',
      builds: 'Staff catalogs, PTO trackers, candidate screening pipelines.',
      icon: <Users className="h-5 w-5 text-primary" />,
      href: '/templates?category=hr-managers',
    },
    {
      role: 'Sales Teams',
      description: 'Monitor pipeline conversions, log client correspondence, track lead stages, and view sales representatives performance indexes.',
      builds: 'CRM consoles, performance leaderboards, client databases.',
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      href: '/templates?category=sales-teams',
    },
    {
      role: 'Finance Operators',
      description: 'Digest billing histories, process refund tickets, audit tax invoices, and analyze recurring revenue cohorts using clean, dense charts.',
      builds: 'Invoice registries, billing ledgers, MRR/LTV reporting charts.',
      icon: <Heart className="h-5 w-5 text-primary" />,
      href: '/templates?category=finance-operators',
    },
  ];


  return (
    <section className="w-full py-[60px] lg:py-[120px] bg-bg-default border-b border-border-default transition-standard">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-3 block">Organization Alignment</span>
        <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-text-heading mb-6">
          Atlas for Every Role
        </h2>
        <p className="text-text-body font-medium max-w-xl mx-auto mb-16">
          Whether you write code daily or manage operational teams, OneAtlas gives you the power to construct robust workflows instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-border-default rounded-[24px] p-[28px] text-left shadow-standard hover:border-[#FFB380] transition-standard flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-[var(--radius-sm)] bg-bg-default text-text-heading border border-border-default">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-text-heading text-lg">{item.role}</h3>
                </div>
                <p className="text-sm text-text-body font-medium leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="border-t border-border-default pt-4 -mx-[28px] -mb-[28px] p-[28px] rounded-b-[24px]">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">What they build:</span>
                <p className="text-xs font-bold text-primary mb-1">{item.builds}</p>
                <Link href={item.href} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent-hover transition-colors mt-3">
                  Explore {item.role.toLowerCase()} templates <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AtlasForRoles;
