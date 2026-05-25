import React from 'react';
import Navbar from '../../../components/nav/Navbar';
import Footer from '../../../components/shared/Footer';
import SectionWrapper from '../../../components/shared/SectionWrapper';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative flex flex-col gap-6 animate-pulse">
          {/* Top Bar Skeleton */}
          <div className="flex justify-between items-center bg-bg-card border border-border-default rounded-2xl p-4 shadow-sm">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-bg-subtle rounded-md" />
              <div className="h-3.5 w-64 bg-bg-subtle rounded-md" />
            </div>
            <div className="h-9 w-24 bg-bg-subtle rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
            {/* Left sidebar: Block templates list skeleton */}
            <div className="lg:col-span-1 bg-bg-card border border-border-default rounded-3xl p-5 space-y-4">
              <div className="h-4 w-32 bg-bg-subtle rounded-md mb-2" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-full bg-bg-subtle border border-border-subtle rounded-xl" />
              ))}
            </div>

            {/* Middle panel: Visual Canvas skeleton */}
            <div className="lg:col-span-2 bg-bg-card border border-border-default rounded-3xl p-6 flex flex-col items-center justify-center gap-6 relative min-h-[400px]">
              <div className="absolute top-4 left-4 h-4 w-28 bg-bg-subtle rounded-md" />
              
              {/* Canvas visual connector blocks flow */}
              <div className="w-full max-w-xs space-y-8 flex flex-col items-center py-8">
                <div className="h-16 w-full bg-bg-subtle border border-border-subtle rounded-2xl relative flex items-center justify-center">
                  <div className="h-4 w-36 bg-bg-card rounded-md" />
                </div>
                <div className="h-8 w-0.5 bg-border-subtle border-dashed border-l-2" />
                <div className="h-16 w-full bg-bg-subtle border border-border-subtle rounded-2xl relative flex items-center justify-center">
                  <div className="h-4 w-36 bg-bg-card rounded-md" />
                </div>
                <div className="h-8 w-0.5 bg-border-subtle border-dashed border-l-2" />
                <div className="h-16 w-full bg-bg-subtle border border-border-subtle rounded-2xl relative flex items-center justify-center">
                  <div className="h-4 w-36 bg-bg-card rounded-md" />
                </div>
              </div>
            </div>

            {/* Right sidebar: Inspector properties panel skeleton */}
            <div className="lg:col-span-1 bg-bg-card border border-border-default rounded-3xl p-5 space-y-4">
              <div className="h-4 w-28 bg-bg-subtle rounded-md mb-2" />
              <div className="h-12 w-full bg-bg-subtle rounded-xl" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-bg-subtle rounded-md" />
                <div className="h-10 w-full bg-bg-subtle rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-bg-subtle rounded-md" />
                <div className="h-20 w-full bg-bg-subtle rounded-xl" />
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
