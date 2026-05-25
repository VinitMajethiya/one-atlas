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
      icon: <Layers className="h-5 w-5 text-accent-pink" />,
      href: '/templates?category=product-managers',
    },
    {
      role: 'Operations Teams',
      description: 'Automate physical warehouse supply tracking, catalog inventory changes, and trigger logistics flows using clean, form-based interfaces.',
      builds: 'Stock controllers, delivery trackers, purchase orders dashboards.',
      icon: <ShieldCheck className="h-5 w-5 text-accent-teal" />,
      href: '/templates?category=operations-teams',
    },
    {
      role: 'HR Managers',
      description: 'Coordinate employee onboarding check-lists, track department vacation applications, and manage global team directories securely.',
      builds: 'Staff catalogs, PTO trackers, candidate screening pipelines.',
      icon: <Users className="h-5 w-5 text-accent-blue" />,
      href: '/templates?category=hr-managers',
    },
    {
      role: 'Sales Teams',
      description: 'Monitor pipeline conversions, log client correspondence, track lead stages, and view sales representatives performance indexes.',
      builds: 'CRM consoles, performance leaderboards, client databases.',
      icon: <DollarSign className="h-5 w-5 text-accent-green" />,
      href: '/templates?category=sales-teams',
    },
    {
      role: 'Finance Operators',
      description: 'Digest billing histories, process refund tickets, audit tax invoices, and analyze recurring revenue cohorts using clean, dense charts.',
      builds: 'Invoice registries, billing ledgers, MRR/LTV reporting charts.',
      icon: <Heart className="h-5 w-5 text-accent-orange" />,
      href: '/templates?category=finance-operators',
    },
  ];


  return (
    <section className="w-full py-16 md:py-24 bg-bg-default border-b border-border-default transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Organization Alignment</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading mb-6 tracking-tight">
          Atlas for Every Role
        </h2>
        <p className="text-text-body font-medium max-w-xl mx-auto mb-16">
          Whether you write code daily or manage operational teams, OneAtlas gives you the power to construct robust workflows instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((item, idx) => (
            <div
              key={idx}
              className="bg-bg-card border border-border-default rounded-2xl p-6 text-left shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-accent-lavender text-text-heading border border-primary/15">
                    {item.icon}
                  </div>
                  <h3 className="font-extrabold text-text-heading text-lg">{item.role}</h3>
                </div>
                <p className="text-sm text-text-body font-medium leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="border-t border-border-subtle pt-4 bg-bg-subtle/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">What they build:</span>
                <p className="text-xs font-bold text-primary mb-1">{item.builds}</p>
                <Link href={item.href} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-3">
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
