'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { BUILDER_SCHEMAS } from '../../../data/builder';
import GeneratingOverlay from '../../../components/builder/GeneratingOverlay';
import BuilderLayout from '../../../components/builder/BuilderLayout';

function BuilderContent() {
  const searchParams = useSearchParams();
  const setSchema = useBuilderStore((state) => state.setSchema);
  const schema = useBuilderStore((state) => state.schema);

  const [isLoading, setIsLoading] = useState(true);

  // Read template slug from URL parameters
  const templateSlug = searchParams.get('template') || 'crm-workspace';

  useEffect(() => {
    // Look up the template schema in BUILDER_SCHEMAS configuration
    const selectedSchema = BUILDER_SCHEMAS[templateSlug] || BUILDER_SCHEMAS['crm-workspace'];
    
    // Deep clone the mock schema state before setting it in store, preventing mutations on import seeds
    setSchema(JSON.parse(JSON.stringify(selectedSchema)));
  }, [templateSlug, setSchema]);

  if (isLoading) {
    return (
      <GeneratingOverlay
        appName={schema?.templateName || 'Workspace App'}
        onComplete={() => setIsLoading(false)}
      />
    );
  }

  return <BuilderLayout />;
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center bg-bg-default">
        <div className="text-text-muted font-bold text-sm">Loading editor console...</div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
