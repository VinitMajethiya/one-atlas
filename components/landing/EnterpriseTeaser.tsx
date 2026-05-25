import React from 'react';
import Link from 'next/link';
import { Shield, Users, Database, ArrowRight } from 'lucide-react';

export function EnterpriseTeaser() {
  const features = [
    {
      title: 'Advanced RBAC permissions',
      description: 'Restrict sensitive dashboard views by department, seniority level, or custom user groups.',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: 'SAML Single Sign-On (SSO)',
      description: 'Hook into Okta, Azure AD, Clerk, or Google Workspace instantly to govern user access.',
      icon: <Shield className="h-6 w-6 text-accent-pink" />,
    },
    {
      title: 'Private Cloud VPC Tunneling',
      description: 'Run app generation behind your firewall and query database endpoints via secure local VPC tunnels.',
      icon: <Database className="h-6 w-6 text-accent-teal" />,
    },
  ];

  const logos = [
    'Stripe', 'Airtable', 'Supabase', 'Figma', 'Retool', 'Linear'
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-accent-lavender/40 border-b border-border-default transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Area - Text & CTA */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Enterprise Ready</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading mb-6 tracking-tight">
              Built for Scale & Compliance
            </h2>
            <p className="text-text-body font-medium leading-relaxed mb-8">
              SaaS dashboard generation is only useful if it meets your company compliance regulations. OneAtlas provides security audits, VPC connections, and identity locks from day one.
            </p>
            <Link
              href="/enterprise"
              className="group inline-flex items-center gap-2 btn-gradient-hero font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-all"
            >
              <span>Learn about Enterprise</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Area - Grid of features & logos */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <div key={idx} className="bg-bg-subtle border border-border-default rounded-xl p-5 text-left shadow-sm">
                  <div className="p-2 w-10 h-10 rounded-lg bg-bg-card text-text-heading mb-4 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h4 className="font-bold text-text-heading text-sm mb-2">{f.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed font-medium">{f.description}</p>
                </div>
              ))}
            </div>

            {/* Mock Customer Logos */}
            <div className="border-t border-border-default/50 pt-8">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-4 text-center lg:text-left">
                Trusted by security teams at fast-growing companies
              </span>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
                {logos.map((logo, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-bold text-text-muted select-none tracking-tight grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default EnterpriseTeaser;
