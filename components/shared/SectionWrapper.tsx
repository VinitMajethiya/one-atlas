import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section id={id} className={`w-full py-[60px] lg:py-[120px] ${className ?? ''}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {children}
      </div>
    </section>
  );
}
export default SectionWrapper;
