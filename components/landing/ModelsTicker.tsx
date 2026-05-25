import React from 'react';
import { Cpu } from 'lucide-react';

export function ModelsTicker() {
  const models = [
    'GPT-4o',
    'Claude 3.5 Sonnet',
    'Gemini 1.5 Pro',
    'DeepSeek V3',
    'Mistral Large',
    'Llama 3.1 405B',
    'GPT-4-turbo',
    'Claude 3 Opus',
    'Qwen 2.5 Coding',
  ];

  // Double the array to ensure seamless infinite looping
  const doubleModels = [...models, ...models, ...models];

  return (
    <section className="w-full py-8 bg-bg-card border-b border-border-default overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
        <Cpu className="h-4.5 w-4.5 text-primary" />
        <span>Build with the latest model architectures</span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Scroller container */}
        <div className="flex gap-4 py-2 animate-ticker whitespace-nowrap">
          {doubleModels.map((model, idx) => (
            <div
              key={idx}
              className="inline-flex items-center bg-bg-subtle text-text-heading font-bold text-sm px-6 py-3 rounded-xl border border-border-default shadow-sm hover:border-primary/30 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-accent-teal mr-3" />
              {model}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ModelsTicker;
