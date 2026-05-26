import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative">
          {/* Breadcrumb Skeleton */}
          <div className="w-48 h-4 bg-bg-subtle rounded-md mb-6 animate-pulse" />

          {/* Title Skeleton */}
          <div className="mb-10 space-y-2">
            <div className="h-8 w-80 bg-bg-subtle rounded-lg animate-pulse" />
            <div className="h-4 w-60 bg-bg-subtle rounded-lg animate-pulse" />
          </div>

          {/* Comparison Matrix Table Skeleton */}
          <div className="overflow-x-auto rounded-3xl border border-border-default bg-bg-card shadow-standard animate-pulse">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border-default bg-bg-subtle/50">
                  <th className="p-5 w-1/4">
                    <div className="h-4 w-24 bg-bg-subtle rounded-md" />
                  </th>
                  {[1, 2, 3].map((i) => (
                    <th key={i} className="p-5 w-1/4 min-w-[240px] border-l border-border-default space-y-2">
                      <div className="h-3 w-16 bg-bg-subtle rounded-md" />
                      <div className="h-5 w-36 bg-bg-subtle rounded-md" />
                      <div className="h-3 w-48 bg-bg-subtle rounded-md" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {/* 5 Rows of spec skeletons */}
                {['Health Score', 'Complexity', 'Pricing Category', 'Tech Stack', 'Integrations'].map((label, idx) => (
                  <tr key={idx}>
                    <td className="p-5 font-bold text-text-muted">
                      <div className="h-4 w-32 bg-bg-subtle rounded-md" />
                    </td>
                    {[1, 2, 3].map((i) => (
                      <td key={i} className="p-5 border-l border-border-default">
                        <div className="h-4 w-24 bg-bg-subtle rounded-md" />
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Action Buttons Row */}
                <tr className="bg-bg-subtle/25">
                  <td className="p-5"></td>
                  {[1, 2, 3].map((i) => (
                    <td key={i} className="p-5 border-l border-border-default">
                      <div className="h-10 w-full bg-bg-subtle rounded-xl" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
