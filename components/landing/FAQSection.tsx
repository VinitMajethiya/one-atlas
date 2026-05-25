'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'What is OneAtlas?',
      answer: 'OneAtlas is an AI-native internal tools development platform. We generate functional frontend layouts (tables, kanbans, charts, forms) and backend data structures based on high-level state schemas and natural language descriptions.',
    },
    {
      question: 'How is this different from a website builder like Webflow?',
      answer: 'Website builders construct landing pages and static marketing sites. OneAtlas generates database-backed operational applications for internal business processes—like CRMs, inventory managers, ticket desks, and team logs. We focus on data density and compliance rather than visual layout design.',
    },
    {
      question: 'Where is my application\'s data stored?',
      answer: 'By default, generated apps hook into our securely managed Postgres database instances. However, Pro and Enterprise plans allow you to link schemas directly to your own self-hosted databases (Postgres, MySQL, DynamoDB) or Snowflake warehouses.',
    },
    {
      question: 'Can I export the code or schema?',
      answer: 'Yes. The entire application state is saved as an open-format JSON schema. You can download this schema at any time, version-control it in GitHub, or run it locally using the open-source OneAtlas CLI runner.',
    },
    {
      question: 'Do you support database relations and nested structures?',
      answer: 'Yes. OneAtlas supports relational keys, foreign references, and sub-object nests. Our builder canvas will automatically render join selectors (like drop-downs and avatars) when a foreign key field is enabled.',
    },
    {
      question: 'Can I add custom JavaScript logic or validations?',
      answer: 'Absolutely. Inside the builder props panel, you can write JavaScript snippets for custom field calculations, API headers, action buttons, and form validation triggers.',
    },
    {
      question: 'Is there a self-hosted option for enterprise requirements?',
      answer: 'Yes. Enterprise customers can deploy the entire OneAtlas runtime engine (including the builder console) on-premise in their own AWS, GCP, or Azure private clouds via Kubernetes/Docker templates.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-bg-muted transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Got Questions?</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading mb-6 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-text-body font-medium max-w-xl mx-auto mb-16">
          Find answers to common questions about our platform capability, security compliance, and licensing.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm hover:border-primary/20 transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-text-heading hover:text-primary transition-colors text-left"
                >
                  <span className="font-bold text-sm md:text-base leading-snug">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-text-body leading-relaxed font-medium border-t border-border-subtle animate-fade-in-up">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
