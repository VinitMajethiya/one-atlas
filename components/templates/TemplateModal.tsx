'use client';

import React from 'react';
import { X, Check, Code, Play } from 'lucide-react';
import { useTemplateStore } from '../../store/useTemplateStore';
import { Badge } from '../shared/Badge';
import { BUILDER_SCHEMAS } from '../../data/builder';

export function TemplateModal() {
  const { selectedTemplate, isModalOpen, closeTemplateDetails } = useTemplateStore();

  if (!isModalOpen || !selectedTemplate) return null;

  // Fetch the actual mock schema for this template slug
  const schemaMock = BUILDER_SCHEMAS[selectedTemplate.slug];
  
  // Format a pretty representation of the schema components tree
  const jsonPreview = schemaMock 
    ? JSON.stringify({
        appId: schemaMock.appId,
        appName: schemaMock.appName,
        version: schemaMock.version,
        templateId: schemaMock.templateId,
        componentsCount: schemaMock.components.length,
        structure: schemaMock.components.map(c => ({
          component: c.name,
          type: c.type,
          fields: c.fields.map(f => f.name),
          childrenCount: c.children.length
        }))
      }, null, 2)
    : '{\n  "error": "Schema not found"\n}';

  // Helper to generate deterministic but random-looking appId for the builder route
  const getBuilderUrl = (slug: string) => {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = (hash << 5) - hash + slug.charCodeAt(i);
      hash |= 0;
    }
    const cleanHash = Math.abs(hash).toString(36).toUpperCase().substring(0, 8);
    return `/builder/${cleanHash}?template=${slug}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in-up">
      {/* Background click listener */}
      <div className="absolute inset-0" onClick={closeTemplateDetails} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-2xl h-full bg-bg-card border-l border-border-default shadow-2xl flex flex-col justify-between z-10 text-left animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-bg-subtle/50">
          <div>
            <div className="flex gap-2 mb-2">
              <Badge label={selectedTemplate.category} />
              <Badge label={selectedTemplate.complexity} />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-text-heading">{selectedTemplate.name}</h2>
          </div>
          <button
            onClick={closeTemplateDetails}
            className="p-2 rounded-xl text-text-muted hover:text-text-heading hover:bg-bg-subtle transition-all"
            aria-label="Close template details"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Long Description */}
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">About this blueprint</h4>
            <p className="text-sm text-text-body font-semibold leading-relaxed">
              {selectedTemplate.longDescription}
            </p>
          </div>

          {/* Included Components */}
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Included UI Components</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedTemplate.components.map((comp) => (
                <div
                  key={comp}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border-subtle bg-bg-subtle/30"
                >
                  <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span className="text-xs md:text-sm text-text-heading font-bold">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schema JSON Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-4.5 w-4.5 text-primary" />
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Application State Schema (JSON)</h4>
            </div>
            <div className="relative bg-dark-navy text-gray-200 p-5 rounded-2xl font-mono text-xs shadow-inner max-h-72 overflow-y-auto">
              <pre className="overflow-x-auto leading-relaxed">
                <code>{jsonPreview}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border-subtle bg-bg-subtle/50 flex gap-4">
          <a
            href={getBuilderUrl(selectedTemplate.slug)}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Generate Workspace App</span>
          </a>
          
          <button
            onClick={closeTemplateDetails}
            className="px-6 py-4 rounded-xl border border-border-default bg-bg-card hover:bg-bg-subtle text-text-heading font-bold text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateModal;
