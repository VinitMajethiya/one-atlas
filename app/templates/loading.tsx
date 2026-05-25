import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import SkeletonCard from '../../components/templates/SkeletonCard';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative flex flex-col gap-8">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-bg-subtle rounded-md animate-pulse" />
              <div className="h-8 w-64 bg-bg-subtle rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-full md:max-w-md bg-bg-card border border-border-default rounded-2xl animate-pulse" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filter skeleton */}
            <div className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="h-48 bg-bg-card border border-border-default rounded-3xl p-6 animate-pulse" />
            </div>

            {/* Grid skeleton */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
