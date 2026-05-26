import React from 'react';
import Link from 'next/link';
import { Lock, FileLock, CheckCircle, ArrowRight } from 'lucide-react';

export function SecurityTeaser() {
  const pillars = [
    {
      title: 'End-to-End Encryption',
      description: 'All database payloads, session state credentials, and generated configurations are encrypted at rest with AES-256 and in transit with TLS 1.3.',
      icon: <Lock className="h-5 w-5 text-[#FF6600]" />,
    },
    {
      title: 'GDPR & CCPA Compliant',
      description: 'Automated data deletion logs, audit trails, and strict tenant access barriers keep user privacy regulated and aligned with EU privacy directives.',
      icon: <CheckCircle className="h-5 w-5 text-[#6B7280]" />,
    },
    {
      title: 'Tenant Network Isolation',
      description: 'Applications run on sandboxed virtualization layers. Your internal tool schemas never share cache databases or compute instances with other teams.',
      icon: <FileLock className="h-5 w-5 text-[#6B7280]" />,
    },
  ];

  return (
    <section className="w-full py-[60px] lg:py-[120px] bg-[#F5F5EE] border-b border-border-default transition-standard">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Feature List */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-[28px] bg-white border border-[#E5E7EB] rounded-[24px] shadow-standard transition-standard"
              >
                <div className="p-2.5 rounded-[var(--radius-sm)] bg-[#F5F5EE] border border-[#E5E7EB] text-text-heading mt-0.5">
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
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-3 block">Compliance Standard</span>
            <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-text-heading mb-6">
              Security Built at Every Layer
            </h2>
            <p className="text-text-body font-medium leading-relaxed mb-8">
              We design our infrastructure to survive rigorous security auditing. Our hosted cloud environment is continuously audited for access controls, database isolation, and patch cycles.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-[#F5F5EE] border border-[#E5E7EB] px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold text-[#6B7280] flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF6600]" />
                SOC 2 Type II
              </span>
              <span className="bg-[#F5F5EE] border border-[#E5E7EB] px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold text-[#6B7280] flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF6600]" />
                GDPR Ready
              </span>
              <span className="bg-[#F5F5EE] border border-[#E5E7EB] px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold text-[#6B7280] flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF6600]" />
                ISO 27001
              </span>
            </div>

            <Link
              href="/security"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#FF6600] hover:text-[#E65C00] transition-colors"
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
