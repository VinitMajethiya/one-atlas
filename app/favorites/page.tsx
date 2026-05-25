'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import TemplateCard from '../../components/templates/TemplateCard';
import SkeletonCard from '../../components/templates/SkeletonCard';
import EmptyState from '../../components/shared/EmptyState';
import ToastContainer from '../../components/shared/Toast';
import TemplateModal from '../../components/templates/TemplateModal';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch('/api/favorites', {
          headers: { 'x-user-id': 'usr_seeded_developer' }
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative">
          <button 
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Marketplace</span>
          </button>

          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight flex items-center gap-2.5">
              <Heart className="w-6 h-6 text-accent-pink fill-current" />
              <span>Bookmarks & Saved Blueprints</span>
            </h1>
            <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
              Your customized list of operational templates
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              title="No saved templates yet."
              description="Browse the marketplace to save some."
              actionText="Browse Marketplace"
              onAction={() => {
                router.push('/templates');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          )}

          <TemplateModal />
          <ToastContainer />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

export default function FavoritesPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <FavoritesPage />
    </PageErrorBoundary>
  );
}
