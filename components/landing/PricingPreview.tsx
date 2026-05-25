'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { PRICING_TIERS } from '../../data/pricing';

export function PricingPreview() {
  return (
    <section className="w-full py-16 md:py-24 bg-bg-default border-b border-border-default transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Flexible Plans</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading mb-6 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-text-body font-medium max-w-xl mx-auto mb-16">
          Start building internal tools for free, then upgrade to collaborate with your team and hook up custom domains.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-bg-card border rounded-2xl p-8 text-left shadow-sm flex flex-col justify-between relative hover:shadow-md transition-all duration-300 ${
                tier.popular 
                  ? 'border-primary ring-2 ring-primary/20 scale-100 md:scale-105 z-10' 
                  : 'border-border-default'
              }`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="font-extrabold text-text-heading text-xl mb-2">{tier.name}</h3>
                <p className="text-xs text-text-muted mb-6 leading-relaxed font-medium">{tier.description}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-3xl md:text-4xl font-extrabold text-text-heading">
                    {tier.priceMonthly === 9999 ? 'Custom' : `$${tier.priceMonthly}`}
                  </span>
                  {tier.priceMonthly !== 9999 && (
                    <span className="text-sm font-semibold text-text-muted ml-1.5">/ month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 border-t border-border-subtle pt-6">
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
                className={`w-full text-center py-3 rounded-xl font-bold text-xs transition-all ${
                  tier.popular
                    ? 'bg-primary hover:bg-primary-light text-white shadow-sm'
                    : 'bg-bg-subtle hover:bg-bg-muted text-text-heading border border-border-default'
                }`}
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
