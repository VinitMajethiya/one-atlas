import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-center min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-mono text-text-muted">Loading developer environments...</span>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
