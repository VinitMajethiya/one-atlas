'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import TemplateFilters from '../../components/templates/TemplateFilters';
import TemplateCard from '../../components/templates/TemplateCard';
import SkeletonCard from '../../components/templates/SkeletonCard';
import EmptyState from '../../components/shared/EmptyState';
import ToastContainer from '../../components/shared/Toast';
import TemplateModal from '../../components/templates/TemplateModal';
import ErrorState from '../../components/shared/ErrorState';
import { Search, ArrowLeft, Loader2, Filter } from 'lucide-react';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const complexity = searchParams.get('complexity') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const catParam = category ? `&category=${category}` : '';
      const compParam = complexity ? `&complexity=${complexity}` : '';
      const res = await fetch(`/api/templates/search?q=${encodeURIComponent(query)}${catParam}${compParam}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.results || []);
      setTotalCount(data.total || 0);
      setFetchError(null);
    } catch (err) {
      console.error('Search failed', err);
      setFetchError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [query, category, complexity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set('q', searchInput.trim());
    } else {
      params.delete('q');
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  if (fetchError) {
    return (
      <SectionWrapper className="bg-bg-default py-20 text-center">
        <ErrorState 
          errorCode="FETCH_ERROR"
          message={fetchError}
          onRetry={() => {
            setFetchError(null);
            performSearch();
          }}
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="bg-bg-default pt-6 pb-28 relative">
      {/* Header Back button */}
      <button 
        onClick={() => router.push('/templates')}
        className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Marketplace</span>
      </button>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight">
          Search Results {query && <span>for &ldquo;{query}&rdquo;</span>}
        </h1>
        <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
          {loading ? 'Searching index...' : `${totalCount} matching blueprints found`}
        </p>
      </div>

      {/* Main Search Input bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mb-10">
        <input
          type="text"
          placeholder="Refine search query..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-12 pr-28 py-3.5 bg-bg-card border border-border-default hover:border-primary/50 focus:border-primary text-sm font-semibold rounded-2xl shadow-sm outline-none transition-all"
        />
        <Search className="w-5 h-5 text-text-muted absolute left-4 top-4 pointer-events-none" />
        <button
          type="submit"
          className="absolute right-2 top-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
        >
          Search
        </button>
      </form>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters */}
        <div className="lg:col-span-1">
          <TemplateFilters
            category={category || null}
            complexity={complexity || null}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title="No templates match your search."
              description="Try different keywords."
              actionText="Reset Search"
              onAction={() => {
                router.push('/search?q=');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          )}
        </div>
      </div>

      <TemplateModal />
      <ToastContainer />
    </SectionWrapper>
  );
}

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <SectionWrapper className="bg-bg-default pt-10 pb-24 text-center">
            <div className="text-text-muted font-bold py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-mono">Loading Search...</span>
            </div>
          </SectionWrapper>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <SearchPage />
    </PageErrorBoundary>
  );
}
