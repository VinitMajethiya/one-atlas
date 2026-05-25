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
          {/* Back button and header skeletons */}
          <div>
            <div className="w-48 h-4 bg-bg-subtle rounded-md mb-6 animate-pulse" />
            <div className="h-8 w-80 bg-bg-subtle rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filter skeleton */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="h-64 bg-bg-card border border-border-default rounded-3xl p-6 animate-pulse" />
            </div>

            {/* Grid skeleton */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
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
