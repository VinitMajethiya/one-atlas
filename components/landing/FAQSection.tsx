'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      question: 'What is OneAtlas?',
      answer: 'OneAtlas is an AI-native internal tools development platform. We generate functional frontend layouts (tables, kanbans, charts, forms) and backend data structures based on high-level state schemas and natural language descriptions.',
      category: 'General',
    },
    {
      question: 'How is this different from a website builder like Webflow?',
      answer: 'Website builders construct landing pages and static marketing sites. OneAtlas generates database-backed operational applications for internal business processes—like CRMs, inventory managers, ticket desks, and team logs. We focus on data density and compliance rather than visual layout design.',
      category: 'General',
    },
    {
      question: 'Where is my application\'s data stored?',
      answer: 'By default, generated apps hook into our securely managed Postgres database instances. However, Pro and Enterprise plans allow you to link schemas directly to your own self-hosted databases (Postgres, MySQL, DynamoDB) or Snowflake warehouses.',
      category: 'Security',
    },
    {
      question: 'Can I export the code or schema?',
      answer: 'Yes. The entire application state is saved as an open-format JSON schema. You can download this schema at any time, version-control it in GitHub, or run it locally using the open-source OneAtlas CLI runner.',
      category: 'Product',
    },
    {
      question: 'Do you support database relations and nested structures?',
      answer: 'Yes. OneAtlas supports relational keys, foreign references, and sub-object nests. Our builder canvas will automatically render join selectors (like drop-downs and avatars) when a foreign key field is enabled.',
      category: 'Product',
    },
    {
      question: 'Can I add custom JavaScript logic or validations?',
      answer: 'Absolutely. Inside the builder props panel, you can write JavaScript snippets for custom field calculations, API headers, action buttons, and form validation triggers.',
      category: 'Product',
    },
    {
      question: 'Is there a self-hosted option for enterprise requirements?',
      answer: 'Yes. Enterprise customers can deploy the entire OneAtlas runtime engine (including the builder console) on-premise in their own AWS, GCP, or Azure private clouds via Kubernetes/Docker templates.',
      category: 'Security',
    },
  ];

  const categories = ['All', 'General', 'Product', 'Security'];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <section className="w-full py-[60px] lg:py-[120px] bg-[#F5F5EE] border-b border-border-default transition-standard">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-left mb-16">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary mb-3 block">Got Questions?</span>
          <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-text-heading mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-body font-medium max-w-xl">
            Find answers to common questions about our platform capability, security compliance, and licensing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-16">
          {/* Left Column: Category Nav Links */}
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIdx(null);
                }}
                className={`text-left text-sm font-semibold py-2 px-4 rounded-[var(--radius-sm)] transition-standard ${
                  activeCategory === cat
                    ? 'bg-white border border-border-default text-primary shadow-standard'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Column: Accordion List */}
          <div className="divide-y divide-[#ECECEC] border-t border-b border-[#ECECEC] text-left">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-6 transition-standard">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-text-heading hover:text-primary transition-colors text-left"
                  >
                    <span className="font-semibold text-[17px] leading-snug">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="pt-4 text-[15px] text-text-body leading-relaxed font-normal animate-fade-in-up">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
