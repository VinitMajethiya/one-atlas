'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import TemplateFilters from '../../components/templates/TemplateFilters';
import TemplateCard from '../../components/templates/TemplateCard';
import TemplateModal from '../../components/templates/TemplateModal';
import SkeletonCard from '../../components/templates/SkeletonCard';
import EmptyState from '../../components/shared/EmptyState';
import ErrorState from '../../components/shared/ErrorState';
import ToastContainer from '../../components/shared/Toast';
import { useTemplateStore } from '../../store/useTemplateStore';
import { 
  Sparkles, Flame, Search, SlidersHorizontal, CheckSquare, Trash2, 
  ArrowRight, X, LayoutGrid, HelpCircle, Loader2 
} from 'lucide-react';

function TemplatesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL search params
  const activeCategory = searchParams.get('category');
  const activeComplexity = searchParams.get('complexity');

  const { compareList, clearCompare, sortBy, setSortBy } = useTemplateStore();

  const [templates, setTemplates] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search & Autocomplete
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Pagination & Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch Featured & Trending once
  useEffect(() => {
    async function fetchCollections() {
      try {
        const [featRes, trendRes] = await Promise.all([
          fetch('/api/featured-collection'),
          fetch('/api/templates/trending')
        ]);
        if (featRes.ok) {
          const featData = await featRes.json();
          setFeatured(featData);
        }
        if (trendRes.ok) {
          const trendData = await trendRes.json();
          setTrending(trendData);
        }
      } catch (err) {
        console.error('Failed to fetch collections:', err);
        setFetchError('Failed to load templates');
      }
    }
    fetchCollections();

    // Telemetry: templates_page_view
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'templates_page_view',
        user_id: 'usr_seeded_developer',
        metadata: {}
      })
    }).catch(console.error);
  }, []);

  // Fetch main templates grid (with filters & sorting)
  const fetchTemplates = async (pageNumber: number, append = false) => {
    if (pageNumber === 1) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const catQuery = activeCategory ? `&category=${activeCategory}` : '';
      const compQuery = activeComplexity ? `&complexity=${activeComplexity}` : '';
      const sortQuery = sortBy ? `&sortBy=${sortBy}` : '';
      
      const res = await fetch(`/api/templates?page=${pageNumber}&limit=6${catQuery}${compQuery}${sortQuery}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      
      const newTemplates = json.data || [];
      if (append) {
        setTemplates(prev => [...prev, ...newTemplates]);
      } else {
        setTemplates(newTemplates);
      }
      setHasMore(newTemplates.length === 6);
    } catch (err) {
      console.error(err);
      setTemplates([]);
      setFetchError('Failed to load templates');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchTemplates(1, false);
  }, [activeCategory, activeComplexity, sortBy]);

  // Infinite Scroll Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loading) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchTemplates(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, loading]);

  // Autocomplete suggestions fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/templates/autocomplete?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFilterChange = async (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);

    // Telemetry: filter_apply
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'filter_apply',
          user_id: 'usr_seeded_developer',
          metadata: { filter_type: key, value: value || 'all' }
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSortChange = async (newSort: string) => {
    setSortBy(newSort);
    // Fire filter_apply event for telemetry
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'filter_apply',
          user_id: 'usr_seeded_developer',
          metadata: { filter_type: 'sort', sort_by: newSort }
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (fetchError) {
    return (
      <SectionWrapper className="bg-bg-default py-20 text-center">
        <ErrorState 
          errorCode="FETCH_ERROR"
          message={fetchError}
          onRetry={() => {
            setFetchError(null);
            fetchTemplates(1, false);
          }}
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="bg-bg-default pt-6 pb-28 relative">
      
      {/* Search and Autocomplete Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">Atlas Templates</span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-text-heading tracking-tight leading-none">
            Operational Blueprints
          </h1>
        </div>

        {/* Autocomplete Input */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-md shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search blueprints or tech stack..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border-default hover:border-primary/50 focus:border-primary text-xs md:text-sm font-semibold rounded-2xl shadow-sm outline-none transition-all"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5 pointer-events-none" />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-2 bg-bg-card border border-border-default rounded-2xl shadow-xl overflow-hidden divide-y divide-border-subtle max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(`/search?q=${encodeURIComponent(s.name)}`);
                  }}
                  className="px-4 py-3 hover:bg-bg-subtle/50 transition-colors flex items-center justify-between cursor-pointer text-left"
                >
                  <div>
                    <h5 className="text-xs font-bold text-text-heading">{s.name}</h5>
                    <p className="text-[10px] text-text-muted font-mono uppercase mt-0.5">{s.category}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Collection section */}
      {featured.length > 0 && (
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <h3 className="text-xs font-bold font-mono text-text-muted uppercase tracking-wider">
              Featured Blueprint Collection
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((item) => (
              <TemplateCard key={`feat-${item.template.id}`} template={item.template} />
            ))}
          </div>
        </div>
      )}

      {/* Trending strip section */}
      {trending.length > 0 && (
        <div className="mb-10 text-left bg-bg-subtle/30 border border-border-default rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <h3 className="text-xs font-bold font-mono text-text-muted uppercase tracking-wider">
              Trending Marketplace Blueprints (Top Velocity)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {trending.map((t) => (
              <Link
                key={`trend-${t.id}`}
                href={`/templates?category=${t.category}`}
                className="bg-bg-card border border-border-subtle hover:border-primary p-3 rounded-xl shadow-sm text-center transition-all group flex flex-col justify-between"
              >
                <span className="text-[11px] font-extrabold text-text-heading group-hover:text-primary transition-colors truncate">
                  {t.name}
                </span>
                <span className="text-[9px] text-text-muted font-mono uppercase mt-1">
                  {t.cloneCount} clones
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Browse area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Sidebar */}
        <div className="lg:col-span-1">
          <TemplateFilters
            category={activeCategory}
            complexity={activeComplexity}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right Cards Grid */}
        <div className="lg:col-span-3 text-left space-y-4">
          
          {/* Grid control bar */}
          <div className="flex justify-between items-center bg-bg-subtle/30 border border-border-subtle p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Blueprints</span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold font-mono text-text-muted">SORT BY</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-bg-card border border-border-subtle text-text-heading text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary transition-all"
              >
                <option value="newest">Newest Blueprints</option>
                <option value="most_cloned">Most Cloned</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="health_score">Health Score</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading Skeleton Grid
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : templates.length === 0 ? (
              <div className="col-span-full py-6">
                <EmptyState
                  title="No blueprints found"
                  description="Try resetting your category or complexity filters, or clear your query."
                  actionText="Reset All Filters"
                  onAction={() => {
                    router.push('/templates');
                  }}
                />
              </div>
            ) : (
              templates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))
            )}

            {/* Infinite Scroll Fetching State */}
            {isFetchingMore && (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={`more-${i}`} />
              ))
            )}
          </div>

          {/* Observer Target */}
          <div ref={observerTarget} className="h-4 w-full" />
        </div>
      </div>

      {/* Floating Compare Tray */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl py-3.5 px-5 shadow-2xl flex items-center gap-6 animate-slide-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-xs font-bold font-mono text-white tracking-wider">
              {compareList.length} BLUEPRINTS CHECKED
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/compare?ids=${compareList.join(',')}`}
              className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <span>Compare Side-by-Side</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => {
                clearCompare();
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Clear Comparison Selection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Details drawer */}
      <TemplateModal />

      {/* Global Slide Toasts Container */}
      <ToastContainer />
    </SectionWrapper>
  );
}

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <SectionWrapper className="bg-bg-default pt-10 pb-24 text-center">
            <div className="text-text-muted font-bold py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-mono">Loading blueprint hub...</span>
            </div>
          </SectionWrapper>
        }>
          <TemplatesContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function TemplatesPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <TemplatesPage />
    </PageErrorBoundary>
  );
}
