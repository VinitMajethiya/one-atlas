'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { PRICING_TIERS } from '../../data/pricing';

export function PricingPreview() {
  return (
    <section className="w-full py-[60px] lg:py-[120px] bg-bg-default border-b border-border-default transition-standard">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-3 block">Flexible Plans</span>
        <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-text-heading mb-6">
          Simple, Transparent Pricing
        </h2>
        <p className="text-text-body font-medium max-w-xl mx-auto mb-16">
          Start building internal tools for free, then upgrade to collaborate with your team and hook up custom domains.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
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
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-[var(--radius-sm)] shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="font-extrabold text-text-heading text-xl mb-2">{tier.name}</h3>
                <p className="text-xs text-text-muted mb-6 leading-relaxed font-medium">{tier.description}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-3xl md:text-4xl font-extrabold text-text-heading">
                    {tier.priceMonthly === 9999 ? 'Custom' : `₹${Math.round(tier.priceMonthly * 80).toLocaleString('en-IN')}`}
                  </span>
                  {tier.priceMonthly !== 9999 && (
                    <span className="text-sm font-semibold text-text-muted ml-1.5">/ month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 border-t border-border-default pt-6">
                  {tier.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-text-body font-semibold">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/pricing"
                className={tier.popular ? 'btn-primary w-full text-xs font-bold' : 'btn-secondary w-full text-xs font-bold'}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <Link
          href="/pricing"
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors"
        >
          <span>View detailed plan comparisons</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}

export default PricingPreview;
