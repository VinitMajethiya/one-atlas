'use client';

import React, { useState } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import { Search, Compass, BookOpen, CreditCard, Layers, Key, ShieldCheck, Mail } from 'lucide-react';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = [
    { title: 'Getting Started', desc: 'App generation guides, first deployment scripts, and terminal setups.', icon: <Compass className="h-6 w-6 text-primary" /> },
    { title: 'Billing & Tiers', desc: 'Upgrade limits, invoice logs, non-profit discounts, and seat limits.', icon: <CreditCard className="h-6 w-6 text-accent-pink" /> },
    { title: 'App Architecture', desc: 'Understanding component trees, state stores, and properties variables.', icon: <Layers className="h-6 w-6 text-accent-teal" /> },
    { title: 'Integrations', desc: 'Connecting schemas directly to PostgreSQL, Salesforce, Stripe, or Slack.', icon: <Key className="h-6 w-6 text-accent-blue" /> },
    { title: 'Security & SSO', desc: 'Configuring SAML login locks, audit logging feeds, and VPC tunnels.', icon: <ShieldCheck className="h-6 w-6 text-accent-orange" /> },
  ];

  const recentArticles = [
    { title: 'Setting up custom domains with SSL certifications', cat: 'Getting Started' },
    { title: 'How to authorize REST headers inside the schema builder', cat: 'App Architecture' },
    { title: 'Continuous deploy triggers with our GitHub Integration', cat: 'Integrations' },
    { title: 'SLA refund protocols and support SLAs tier levels', cat: 'Billing & Tiers' },
  ];

  const filteredArticles = searchQuery === ''
    ? recentArticles
    : recentArticles.filter(art => 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        
        {/* Support Hero with Search Bar */}
        <SectionWrapper className="bg-bg-default grid-mesh pt-20 pb-16 text-center">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Help Center</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-heading mb-6 tracking-tight">
              How can we help you?
            </h1>
            
            {/* Search Input Container */}
            <div className="max-w-xl mx-auto relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search tutorials, articles, or compliance questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-card border border-border-default hover:border-primary/30 focus:border-primary rounded-2xl py-4.5 pl-12 pr-4 text-sm font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 text-text-heading transition-all"
              />
            </div>
          </div>
        </SectionWrapper>

        {/* Categories Cards */}
        <SectionWrapper className="bg-bg-subtle border-t border-b border-border-default pt-16 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {categories.map((c, idx) => (
              <div
                key={idx}
                className="bg-bg-card border border-border-default rounded-2xl p-6 text-left shadow-sm hover:border-primary/20 transition-standard flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 w-11 h-11 rounded-xl bg-bg-subtle text-text-heading mb-5 flex items-center justify-center">
                    {c.icon}
                  </div>
                  <h3 className="font-extrabold text-text-heading text-sm mb-2">{c.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-semibold">{c.desc}</p>
                </div>
                <button
                  onClick={() => setSearchQuery(c.title)}
                  className="text-xs font-bold text-primary hover:text-primary-light transition-colors mt-6 text-left"
                >
                  Browse Articles →
                </button>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Recent Articles list */}
        <SectionWrapper className="bg-bg-default">
          <div className="max-w-3xl mx-auto text-left">
            <h2 className="text-xl md:text-2xl font-extrabold text-text-heading tracking-tight mb-8">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Help Articles'}
            </h2>
            <div className="space-y-4">
              {filteredArticles.map((art, idx) => (
                <div
                  key={idx}
                  className="bg-bg-subtle border border-border-default rounded-xl p-5 flex justify-between items-center shadow-sm hover:border-primary/25 transition-all cursor-pointer"
                  onClick={() => alert(`Full text mock content for "${art.title}"`)}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-bold text-text-heading text-xs md:text-sm leading-snug">{art.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-bg-card border border-border-subtle px-2 py-1 rounded-full shrink-0">
                    {art.cat}
                  </span>
                </div>
              ))}

              {filteredArticles.length === 0 && (
                <div className="text-center py-8 text-text-muted font-bold text-sm">
                  No articles matched your query. Try searching for &quot;SSO&quot; or &quot;domains&quot;.
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>

        {/* Contact Form at bottom */}
        <SectionWrapper className="bg-bg-subtle border-t border-border-default">
          <div className="max-w-xl mx-auto text-left">
            <div className="text-center mb-10">
              <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold text-text-heading tracking-tight mb-2">Still need assistance?</h2>
              <p className="text-xs md:text-sm text-text-muted font-semibold">Drop our team an email request and we&apos;ll reply within 12 hours.</p>
            </div>

            <form onSubmit={handleSubmitContact} className="bg-bg-card border border-border-default rounded-3xl p-8 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-heading uppercase tracking-wide mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your-email@company.com"
                  className="w-full bg-bg-subtle border border-border-default focus:border-primary rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 text-text-heading"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-heading uppercase tracking-wide mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Requesting custom trial extension"
                  className="w-full bg-bg-subtle border border-border-default focus:border-primary rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 text-text-heading"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-heading uppercase tracking-wide mb-1">Message Detail</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain your operational requirements..."
                  className="w-full bg-bg-subtle border border-border-default focus:border-primary rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 text-text-heading resize-none"
                />
              </div>

              {formSubmitted ? (
                <div className="bg-tint-teal text-accent-green border border-accent-teal/25 p-4 rounded-xl text-xs font-bold text-center">
                  Request successfully sent! Our team will contact you shortly.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-standard"
                >
                  Send Support Request
                </button>
              )}
            </form>
          </div>
        </SectionWrapper>

      </main>
      <Footer />
    </>
  );
}
