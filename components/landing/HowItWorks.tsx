import React from 'react';
import { MessageSquare, Settings, Zap } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Describe your app',
      description: 'Input your requirements in plain English. Our engine translates prompts into unified functional components.',
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      num: '02',
      title: 'Schema is generated',
      description: 'Review the automatically structured database tables, field visibility toggles, and panel layouts.',
      icon: <Settings className="h-6 w-6 text-accent-pink" />,
      color: 'bg-accent-pink/10 text-accent-pink',
    },
    {
      num: '03',
      title: 'Deploy instantly',
      description: 'Click deploy to push your app to a secure global endpoint. Instantly invite your team to log in.',
      icon: <Zap className="h-6 w-6 text-accent-teal" />,
      color: 'bg-accent-teal/10 text-accent-teal',
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-bg-subtle border-t border-b border-border-default transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">Process Flow</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-heading mb-6 tracking-tight">
          How OneAtlas Works
        </h2>
        <p className="text-text-body font-medium max-w-xl mx-auto mb-16">
          Go from operational concept to hosted, functional SaaS dashboard in minutes. No complex build pipelines, no manual layout code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1.5px] bg-border-default -translate-y-12 z-0" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-bg-card border border-border-default rounded-2xl p-8 relative z-10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
            >
              {/* Icon Bubble */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 mx-auto ${step.color} group-hover:scale-110 transition-transform duration-200`}>
                {step.icon}
              </div>

              {/* Step number */}
              <div className="absolute top-4 right-6 text-3xl font-extrabold text-border-default/70 font-mono select-none dark:text-border-default/30">
                {step.num}
              </div>

              <h3 className="text-lg font-bold text-text-heading mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-sm text-text-body font-medium leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
