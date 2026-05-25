'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { BUILDER_SCHEMAS } from '../../../data/builder';
import GeneratingOverlay from '../../../components/builder/GeneratingOverlay';
import BuilderLayout from '../../../components/builder/BuilderLayout';

function BuilderContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const appId = params?.appId as string;

  const setSchema = useBuilderStore((state) => state.setSchema);
  const updateAppName = useBuilderStore((state) => state.updateAppName);
  const schema = useBuilderStore((state) => state.schema);

  const [isLoading, setIsLoading] = useState(true);

  // Read template slug from URL parameters
  const templateSlug = searchParams.get('template') || 'crm-workspace';

  useEffect(() => {
    async function loadSchema() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/apps/${appId}`);
        if (!res.ok) throw new Error('App not found');
        const json = await res.json();
        setSchema(json.data.schema.content);
        updateAppName(json.data.name);
      } catch {
        // Fallback to mock schema from data/builder.ts if API fails
        const fallback = BUILDER_SCHEMAS[templateSlug] || BUILDER_SCHEMAS['crm-workspace'];
        setSchema(JSON.parse(JSON.stringify(fallback)));
      } finally {
        // Let GeneratingOverlay finish its animation, then reveal builder
        setTimeout(() => setIsLoading(false), 2200);
      }
    }
    loadSchema();
  }, [appId, templateSlug, setSchema, updateAppName]);

  if (isLoading) {
    return (
      <GeneratingOverlay
        appName={schema?.appName || 'Workspace App'}
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
