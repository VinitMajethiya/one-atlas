import React from 'react';
import Link from 'next/link';
import { Shield, Key, History, Server, Check, ArrowRight, MessageSquare } from 'lucide-react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';

export const metadata = {
  title: 'OneAtlas for Enterprise — Scale and Governance Controls',
  description: 'Identity single sign-on (SSO), granular role permissions (RBAC), and virtual isolated database pipelines built for compliance.',
};

export default function EnterprisePage() {
  const complianceFeatures = [
    {
      title: 'SAML Single Sign-On (SSO)',
      description: 'Centralize user identity checks via integration with Okta, Ping Identity, Active Directory, or Google Workspace.',
      icon: <Key className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Granular Role-Based Access Control (RBAC)',
      description: 'Define customized permission tiers (e.g. Finance Admin, Regional Agent) to lock down access to operational fields.',
      icon: <Shield className="h-6 w-6 text-accent-pink" />,
    },
    {
      title: 'Immutable Audit Trails',
      description: 'Audit logs tracking schema modifications, data query history, user login events, and key exports.',
      icon: <History className="h-6 w-6 text-accent-teal" />,
    },
    {
      title: 'Dedicated VPC Cloud Isolation',
      description: 'Isolate database instances and hosting servers. Prevent multi-tenant resource leakage.',
      icon: <Server className="h-6 w-6 text-accent-blue" />,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        
        {/* Enterprise Hero */}
        <SectionWrapper className="bg-bg-default grid-mesh pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">OneAtlas for Teams</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-heading mb-6 tracking-tight">
              Enterprise Control, Prototyping Velocity
            </h1>
            <p className="text-base md:text-xl text-text-body font-medium leading-relaxed max-w-2xl mx-auto mb-10">
              Give operations managers the speed of AI-generation while satisfying security teams with SAML SSO, VPC tunneling, database locks, and compliance audits.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:sales@mock-oneatlas.com"
                className="bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Talk to Sales
              </a>
              <Link
                href="/templates"
                className="bg-bg-card hover:bg-bg-subtle text-text-heading border border-border-default font-bold px-8 py-4 rounded-xl shadow-sm transition-all"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </SectionWrapper>

        {/* Feature Highlights Grid */}
        <SectionWrapper className="bg-bg-subtle border-t border-b border-border-default">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-text-heading tracking-tight mb-4">
              Designed for Compliance-Sensitive Infrastructures
            </h2>
            <p className="text-text-muted text-sm md:text-base font-semibold">
              Deploy secure database interfaces without sacrificing organizational compliance parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {complianceFeatures.map((f, idx) => (
              <div key={idx} className="bg-bg-card border border-border-default rounded-2xl p-8 flex gap-6 text-left shadow-sm">
                <div className="p-3 w-12 h-12 rounded-xl bg-bg-subtle text-text-heading flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-text-heading text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-text-body font-semibold leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Testimonials / customer quotes */}
        <SectionWrapper className="bg-bg-default">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-pink mb-3 block">Corporate Trust</span>
            <div className="bg-bg-subtle border border-border-default rounded-3xl p-8 md:p-12 relative shadow-sm">
              <p className="text-lg md:text-xl font-bold text-text-heading italic leading-relaxed mb-6">
                "OneAtlas allowed us to build 14 operational tools in a single quarter. Previously, our developers would have spent months writing dashboard layouts. The SOC 2 and Okta integrations made security approval instant."
              </p>
              <div>
                <h4 className="font-extrabold text-text-heading text-sm">Gavin Finch</h4>
                <p className="text-xs text-text-muted mt-0.5">Head of Operations, FinSecure Group</p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* CTA Section */}
        <SectionWrapper className="bg-primary text-white text-center py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Ready to Secure your Internal Tool Stack?
            </h2>
            <p className="text-primary-light font-bold text-base md:text-lg mb-10 max-w-xl mx-auto">
              Set up a sandbox workspace, try out database tunneling, or request a custom SOC2 compliance audit report.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="mailto:sales@mock-oneatlas.com"
                className="w-full sm:w-auto bg-white text-primary hover:bg-bg-subtle font-extrabold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Enterprise Sales</span>
              </a>
              <Link
                href="/templates"
                className="w-full sm:w-auto bg-primary-light/30 hover:bg-primary-light/50 text-white border border-white/20 font-bold px-8 py-4 rounded-xl transition-all"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </SectionWrapper>

      </main>
      <Footer />
    </>
  );
}
