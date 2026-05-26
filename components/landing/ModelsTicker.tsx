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
  ];

  // Double the array to ensure seamless infinite looping
  const doubleModels = [...models, ...models, ...models];

  return (
    <section className="w-full py-8 bg-[#F5F5EE] border-b border-[#E5E7EB] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-5 mb-4 flex items-center justify-center gap-2 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">
        <Cpu className="h-4.5 w-4.5 text-[#FF6600]" />
        <span>Build with the latest model architectures</span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Scroller container */}
        <div className="flex flex-row gap-4 py-2 animate-ticker whitespace-nowrap">
          {doubleModels.map((model, idx) => (
            <div
              key={idx}
              className="w-[220px] h-[80px] rounded-[28px] bg-white border border-[#ECECEC] flex-shrink-0 inline-flex items-center justify-center gap-3 hover:-translate-y-1 hover:border-[#D1D5DB] transition-standard cursor-default"
            >
              <Cpu className="h-5 w-5 text-[#6B7280]" />
              <span className="text-[#111111] font-bold text-sm">{model}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ModelsTicker;
