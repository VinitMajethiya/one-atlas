'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import { PRICING_TIERS, FEATURE_COMPARISON } from '../../data/pricing';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const formatRupees = (usdAmount: number) => {
    if (usdAmount === 0) return '₹0';
    return '₹' + Math.round(usdAmount * 80).toLocaleString('en-IN');
  };

  const getPriceDisplay = (monthly: number, annualRate: number) => {
    if (monthly === 9999) return 'Custom';
    return isAnnual ? formatRupees(annualRate) : formatRupees(monthly);
  };

  const pricingFaqs = [
    {
      q: 'Can I cancel my subscription at any time?',
      a: 'Yes. You can cancel your Pro plan directly from your workspace dashboard settings. Once cancelled, your plan remains active until the end of the current billing cycle.',
    },
    {
      q: 'Do you offer discount plans for non-profits or educational users?',
      a: 'Yes, we offer 50% discount plans for academic institutions, student groups, and registered non-profit organizations. Reach out to our billing support department.',
    },
    {
      q: 'What happens when I hit my active applications limit on the Free plan?',
      a: 'You will receive a warning banner. Your active apps will continue running, but you won\'t be able to edit their schemas or launch new configurations until you archive an app or upgrade to Pro.',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        
        {/* Pricing Hero */}
        <SectionWrapper className="bg-bg-default pt-20 pb-12">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-3 block">Pricing Plans</span>
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold leading-[0.95] tracking-[-0.04em] text-text-heading mb-6">
              Honest, Transparent Pricing
            </h1>
            <p className="text-base md:text-xl text-text-body font-medium leading-relaxed max-w-xl mx-auto mb-10">
              Pick the tier that fits your build requirements. No surprise costs, no user seats multipliers.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-3 bg-white border border-border-default p-1.5 rounded-[var(--radius-sm)] shadow-standard">
              <button
                onClick={() => setIsAnnual(false)}
                className={!isAnnual ? 'btn-primary h-10 text-xs px-4 py-2' : 'btn-secondary h-10 text-xs px-4 py-2 border-none bg-transparent'}
              >
                Billed Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative ${isAnnual ? 'btn-primary h-10 text-xs px-4 py-2' : 'btn-secondary h-10 text-xs px-4 py-2 border-none bg-transparent'}`}
              >
                Billed Annually
                <span className="absolute -top-3 -right-6 bg-primary text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-[var(--radius-sm)] rotate-12 shadow-sm">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Pricing Cards Grid */}
        <SectionWrapper className="bg-bg-default pt-0 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white border text-left shadow-standard flex flex-col justify-between relative transition-standard rounded-[24px] p-[28px] ${
                  tier.popular 
                    ? 'border-[1.5px] border-[#FF6600] z-10' 
                    : 'border-border-default'
                }`}
              >
                {tier.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-[var(--radius-sm)] shadow-standard">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-text-heading text-2xl mb-2">{tier.name}</h3>
                  <p className="text-xs md:text-sm text-text-muted mb-8 leading-relaxed font-semibold">{tier.description}</p>
                  
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl md:text-5xl font-extrabold text-text-heading">
                      {getPriceDisplay(tier.priceMonthly, tier.priceAnnually)}
                    </span>
                    {tier.priceMonthly !== 9999 && (
                      <span className="text-sm font-semibold text-text-muted ml-2">/ month</span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 border-t border-border-default pt-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-xs md:text-sm text-text-body font-semibold">
                        <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={tier.priceMonthly === 9999 ? 'mailto:sales@mock-oneatlas.com' : '/templates'}
                  className={tier.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Feature Comparison Table */}
        <SectionWrapper className="bg-[#F5F5EE] border-t border-b border-border-default">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-text-heading mb-4">
              Compare Platform Capabilities
            </h2>
            <p className="text-text-muted text-sm md:text-base font-semibold">
              Take a closer look at our granular features, compliance controls, and support thresholds.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-border-default rounded-[24px] overflow-hidden shadow-standard">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-default bg-[#F5F5EE]/50 text-xs font-extrabold uppercase tracking-wider text-text-heading">
                    <th className="p-5 pl-8">Features</th>
                    <th className="p-5">Free</th>
                    <th className="p-5">Pro</th>
                    <th className="p-5">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default text-xs md:text-sm font-semibold text-text-body">
                  {FEATURE_COMPARISON.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F5EE]/30 transition-colors">
                      <td className="p-5 pl-8 font-bold text-text-heading">{row.feature}</td>
                      <td className="p-5">{row.free === '✔' ? <Check className="h-4 w-4 text-primary" /> : row.free === '✘' ? <X className="h-4 w-4 text-text-muted" /> : row.free}</td>
                      <td className="p-5">{row.pro === '✔' ? <Check className="h-4 w-4 text-primary" /> : row.pro === '✘' ? <X className="h-4 w-4 text-text-muted" /> : row.pro}</td>
                      <td className="p-5">{row.enterprise === '✔' ? <Check className="h-4 w-4 text-primary" /> : row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionWrapper>

        {/* Pricing FAQs */}
        <SectionWrapper className="bg-bg-default">
          <div className="max-w-3xl mx-auto text-left">
            <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-text-heading mb-12 text-center">
              Pricing FAQs
            </h2>
            <div className="space-y-6">
              {pricingFaqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-[24px] p-[28px] shadow-standard">
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
