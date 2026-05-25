import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import { Lock, FileLock, CheckCircle, Database, ShieldAlert, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'OneAtlas Security — Compliance and Architecture Standards',
  description: 'SOC 2 Type II compliance, advanced tenant network isolation, and database payload encryption details.',
};

export default function SecurityPage() {
  const pillars = [
    {
      title: 'Payload Data Encryption',
      description: 'All state values, database strings, API authorization tokens, and server configurations are encrypted at rest using AES-256 and in transit using TLS 1.3.',
      icon: <Lock className="h-6 w-6 text-accent-pink" />,
    },
    {
      title: 'Strict Tenant Isolation',
      description: 'Customer application environments run on sandboxed virtualization containers. Your databases and server caches never share CPU memory with other tenants.',
      icon: <FileLock className="h-6 w-6 text-accent-teal" />,
    },
    {
      title: 'RBAC Authorization Locks',
      description: 'Coordinate employee access scopes dynamically. Restrict write/read actions at the page, dashboard, or database table level.',
      icon: <Database className="h-6 w-6 text-accent-blue" />,
    },
    {
      title: 'Continuous Vulnerability Scans',
      description: 'Our repositories and container layers are scanned hourly for dependencies security holes. We run semi-annual external network penetration testing.',
      icon: <ShieldAlert className="h-6 w-6 text-accent-orange" />,
    },
  ];

  const securityFaqs = [
    {
      q: 'Does OneAtlas store my database credentials?',
      a: 'If you connect external databases (like Postgres or Snowflake), credentials are saved in isolated vault containers encrypted using customer-managed KMS keys. Credentials are never written to logs or readable by staff members.',
    },
    {
      q: 'Are generated applications SOC 2 compliant?',
      a: 'Yes. Our hosted hosting environment satisfies SOC 2 Type II audit standards. Because your applications run on our audited sandboxed layers, they automatically inherit these compliance parameters.',
    },
    {
      q: 'Can I host generated apps in my own AWS or Azure VPC?',
      a: 'Absolutely. Enterprise tier customers can deploy the OneAtlas runner inside their own private VPC networks. No data ever leaves your cloud environment.',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        
        {/* Security Hero */}
        <SectionWrapper className="bg-bg-default grid-mesh pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-pink mb-3 block">Compliance First</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-heading mb-6 tracking-tight">
              Security Built at Every Layer
            </h1>
            <p className="text-base md:text-xl text-text-body font-medium leading-relaxed max-w-2xl mx-auto mb-10">
              OneAtlas is designed to withstand rigorous security audits. We secure your database connections, isolate customer instances, and encrypt data payloads continuously.
            </p>
            
            {/* Compliance badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-bg-card border border-border-default px-4 py-3 rounded-2xl text-sm font-bold text-text-heading flex items-center gap-2 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
                SOC 2 Type II Certified
              </span>
              <span className="bg-bg-card border border-border-default px-4 py-3 rounded-2xl text-sm font-bold text-text-heading flex items-center gap-2 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
                GDPR & CCPA Compliant
              </span>
              <span className="bg-bg-card border border-border-default px-4 py-3 rounded-2xl text-sm font-bold text-text-heading flex items-center gap-2 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
                ISO 27001 Audited
              </span>
            </div>
          </div>
        </SectionWrapper>

        {/* Security Pillars Grid */}
        <SectionWrapper className="bg-bg-subtle border-t border-b border-border-default">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-text-heading tracking-tight mb-4">
              Our Security Pillars
            </h2>
            <p className="text-text-muted text-sm md:text-base font-semibold">
              Prototyping velocity is nothing without immutable security boundaries. Here is how we safeguard your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pillars.map((item, idx) => (
              <div key={idx} className="bg-bg-card border border-border-default rounded-2xl p-8 flex gap-6 text-left shadow-sm">
                <div className="p-3 w-12 h-12 rounded-xl bg-bg-subtle text-text-heading flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-text-heading text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-text-body font-semibold leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Security FAQs */}
        <SectionWrapper className="bg-bg-default">
          <div className="max-w-3xl mx-auto text-left">
            <h2 className="text-2xl md:text-4xl font-extrabold text-text-heading tracking-tight mb-12 text-center">
              Security & Compliance FAQs
            </h2>
            <div className="space-y-6">
              {securityFaqs.map((faq, idx) => (
                <div key={idx} className="bg-bg-subtle border border-border-default rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-text-heading text-sm md:text-base mb-2">{faq.q}</h3>
                  <p className="text-xs md:text-sm text-text-body font-semibold leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

      </main>
      <Footer />
    </>
  );
}
