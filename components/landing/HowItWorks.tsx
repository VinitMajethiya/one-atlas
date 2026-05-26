import React from 'react';
import { MessageSquare, Settings, Zap } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Describe your app',
      description: 'Input your requirements in plain English. Our engine translates prompts into unified functional components.',
      icon: <MessageSquare className="h-6 w-6 text-[#FF6600]" />,
    },
    {
      num: '02',
      title: 'Schema is generated',
      description: 'Review the automatically structured database tables, field visibility toggles, and panel layouts.',
      icon: <Settings className="h-6 w-6 text-[#6B7280]" />,
    },
    {
      num: '03',
      title: 'Deploy instantly',
      description: 'Click deploy to push your app to a secure global endpoint. Instantly invite your team to log in.',
      icon: <Zap className="h-6 w-6 text-[#FF6600]" />,
    },
  ];

  return (
    <section className="w-full py-[60px] lg:py-[120px] bg-[#F5F5EE] border-t border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#FF6600] mb-3 block">Process Flow</span>
        <h2 className="text-[48px] font-[650] leading-[1] tracking-[-0.03em] text-[#111111] mb-6">
          How OneAtlas Works
        </h2>
        <p className="text-[18px] leading-[1.7] text-[#6B7280] font-normal max-w-xl mx-auto mb-16">
          Go from operational concept to hosted, functional SaaS dashboard in minutes. No complex build pipelines, no manual layout code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1.5px] bg-[#E5E7EB] -translate-y-12 z-0" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E7EB] rounded-[24px] p-[28px] relative z-10 shadow-standard hover:border-[#FFB380] transition-standard group"
            >
              {/* Icon Bubble */}
              <div className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center mb-6 mx-auto bg-[#F5F5EE] border border-[#E5E7EB] text-[#111111] group-hover:scale-110 transition-transform duration-200">
                {step.icon}
              </div>

              {/* Step number */}
              <div className="absolute top-4 right-6 text-3xl font-extrabold text-[#E5E7EB] font-mono select-none">
                {step.num}
              </div>

              <h3 className="text-[22px] font-semibold text-[#111111] mb-3 group-hover:text-[#FF6600] transition-colors">{step.title}</h3>
              <p className="text-sm text-[#6B7280] font-medium leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
