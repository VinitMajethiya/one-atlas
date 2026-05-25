import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative space-y-8 animate-pulse">
          {/* Back button link skeleton */}
          <div className="w-48 h-4 bg-bg-subtle rounded-md" />

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-96 bg-bg-subtle rounded-lg" />
            <div className="h-4 w-120 bg-bg-subtle rounded-lg" />
          </div>

          {/* Limits Banner Card Skeleton */}
          <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-48 bg-bg-subtle rounded-md" />
              <div className="h-4 w-32 bg-bg-subtle rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-bg-subtle border border-border-subtle rounded-2xl p-4 space-y-2">
                  <div className="h-3 w-20 bg-bg-card rounded-md" />
                  <div className="h-6 w-32 bg-bg-card rounded-md" />
                  <div className="w-full bg-bg-card h-2 rounded-full overflow-hidden" />
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation row skeleton */}
          <div className="flex border-b border-border-default gap-4 overflow-x-auto pb-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-28 bg-bg-subtle rounded-t-lg" />
            ))}
          </div>

          {/* Main Content Area: Data Table Skeleton */}
          <div className="bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-default flex justify-between items-center">
              <div className="h-5 w-32 bg-bg-subtle rounded-md" />
              <div className="h-9 w-24 bg-bg-subtle rounded-xl" />
            </div>
            <div className="divide-y divide-border-subtle">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6 flex justify-between items-center">
                  <div className="space-y-2 w-1/3">
                    <div className="h-4 w-40 bg-bg-subtle rounded-md" />
                    <div className="h-3 w-64 bg-bg-subtle rounded-md" />
                  </div>
                  <div className="h-4 w-20 bg-bg-subtle rounded-md" />
                  <div className="h-6 w-16 bg-bg-subtle rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
