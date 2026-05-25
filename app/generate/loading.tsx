import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-bg-default py-16 px-4">
        <SectionWrapper className="max-w-2xl w-full bg-bg-card border border-border-default rounded-3xl p-8 md:p-12 shadow-xl animate-pulse text-center space-y-6">
          {/* Logo Icon Skeleton */}
          <div className="w-12 h-12 bg-bg-subtle border border-border-subtle rounded-2xl mx-auto" />

          {/* Heading Skeletons */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-bg-subtle rounded-lg mx-auto" />
            <div className="h-4 w-96 bg-bg-subtle rounded-lg mx-auto" />
          </div>

          {/* Input Area Skeletons */}
          <div className="space-y-4">
            <div className="h-28 w-full bg-bg-subtle rounded-2xl" />
            <div className="h-12 w-full bg-bg-subtle rounded-xl" />
          </div>

          {/* Quick Recommendations skeletons */}
          <div className="border-t border-border-subtle pt-6 space-y-4">
            <div className="h-3 w-48 bg-bg-subtle rounded-md mx-auto" />
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-28 bg-bg-subtle border border-border-subtle rounded-xl" />
              ))}
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
