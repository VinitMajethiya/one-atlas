import React from 'react';
import Link from 'next/link';
import { Lock, FileLock, CheckCircle, ArrowRight } from 'lucide-react';

export function SecurityTeaser() {
  const pillars = [
    {
      title: 'End-to-End Encryption',
      description: 'All database payloads, session state credentials, and generated configurations are encrypted at rest with AES-256 and in transit with TLS 1.3.',
      icon: <Lock className="h-5 w-5 text-accent-pink" />,
    },
    {
      title: 'GDPR & CCPA Compliant',
      description: 'Automated data deletion logs, audit trails, and strict tenant access barriers keep user privacy regulated and aligned with EU privacy directives.',
      icon: <CheckCircle className="h-5 w-5 text-accent-teal" />,
    },
    {
      title: 'Tenant Network Isolation',
      description: 'Applications run on sandboxed virtualization layers. Your internal tool schemas never share cache databases or compute instances with other teams.',
      icon: <FileLock className="h-5 w-5 text-accent-blue" />,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-bg-subtle border-b border-border-default transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Feature List */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-bg-card border border-border-default rounded-xl shadow-sm"
              >
                <div className="p-2.5 rounded-lg bg-bg-subtle text-text-heading mt-0.5">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-text-heading text-sm mb-1">{item.title}</h4>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Copy & Badges */}
          <div className="lg:col-span-5 order-1 lg:order-2 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-pink mb-3 block">Compliance Standard</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading mb-6 tracking-tight">
              Security Built at Every Layer
            </h2>
            <p className="text-text-body font-medium leading-relaxed mb-8">
              We design our infrastructure to survive rigorous security auditing. Our hosted cloud environment is continuously audited for access controls, database isolation, and patch cycles.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-tint-teal border border-accent-teal/25 px-3 py-2 rounded-xl text-xs font-bold text-accent-green flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-teal" />
                SOC 2 Type II
              </span>
              <span className="bg-tint-teal border border-accent-teal/25 px-3 py-2 rounded-xl text-xs font-bold text-accent-green flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-teal" />
                GDPR Ready
              </span>
              <span className="bg-tint-teal border border-accent-teal/25 px-3 py-2 rounded-xl text-xs font-bold text-accent-green flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-teal" />
                ISO 27001
              </span>
            </div>

            <Link
              href="/security"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-accent-pink hover:text-accent-pink/80 transition-colors"
            >
              <span>Explore our security pillars</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default SecurityTeaser;
