'use client';

import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ComponentNode } from '../../types/builder';
import { Eye, EyeOff, Sliders, ToggleLeft, Hash, Edit3 } from 'lucide-react';

export function PropsPanel() {
  const { 
    schema, selectedNodeId, updateComponentProps, 
    updateComponentFieldVisibility, updateComponentFieldLabel 
  } = useBuilderStore();

  if (!schema) return null;

  // Recursive search to locate the active node
  const findSelectedNode = (nodes: ComponentNode[], id: string): ComponentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        const found = findSelectedNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findSelectedNode(schema.components, selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <div className="flex flex-col h-full bg-bg-card">
        <div className="h-10 border-b border-border-subtle flex items-center px-4 font-bold text-xs text-text-muted uppercase tracking-wider select-none shrink-0 bg-bg-subtle/50">
          Node Properties
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted select-none">
          <Sliders className="h-8 w-8 mb-3 opacity-40 text-primary" />
          <p className="text-xs font-bold leading-relaxed max-w-[180px]">
            Select a node from the Tree or Canvas to customize its settings.
          </p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: string | number | boolean) => {
    updateComponentProps(selectedNode.id, { [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-bg-card text-left select-none">
      <div className="h-10 border-b border-border-subtle flex items-center px-4 font-bold text-xs text-text-muted uppercase tracking-wider shrink-0 bg-bg-subtle/50">
        Properties: {selectedNode.type}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        
        {/* Section 1: Info */}
        <div className="bg-bg-subtle/50 border border-border-subtle rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Node Name</span>
          <h4 className="text-xs font-bold text-text-heading">{selectedNode.name}</h4>
          <p className="text-[10px] text-text-muted font-bold font-mono">ID: {selectedNode.id}</p>
        </div>

        {/* Section 2: General Props */}
        {Object.keys(selectedNode.props).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider pb-2 border-b border-border-subtle">
              Configurations
            </h3>
            
            <div className="space-y-3.5">
              {Object.entries(selectedNode.props).map(([key, val]) => {
                const isString = typeof val === 'string';
                const isNumber = typeof val === 'number';
                const isBoolean = typeof val === 'boolean';

                return (
                  <div key={key} className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-heading uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>

                    {isString && (
                      <input
                        type="text"
                        value={val as string}
                        onChange={(e) => handlePropChange(key, e.target.value)}
                        className="w-full bg-bg-subtle border border-border-default hover:border-primary/20 focus:border-primary focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold text-text-heading"
                      />
                    )}

                    {isNumber && (
                      <input
                        type="number"
                        value={val as number}
                        onChange={(e) => handlePropChange(key, parseFloat(e.target.value) || 0)}
                        className="w-full bg-bg-subtle border border-border-default hover:border-primary/20 focus:border-primary focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold text-text-heading"
                      />
                    )}

                    {isBoolean && (
                      <button
                        onClick={() => handlePropChange(key, !val)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                          val 
                            ? 'bg-primary/5 border-primary/20 text-primary' 
                            : 'bg-bg-subtle border-border-default text-text-muted'
                        }`}
                      >
                        <span>{val ? 'Enabled' : 'Disabled'}</span>
                        <ToggleLeft className={`h-5 w-5 transition-transform ${val ? 'rotate-180 text-primary' : ''}`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Field Toggles */}
        {selectedNode.fields && selectedNode.fields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider pb-2 border-b border-border-subtle">
              Database Fields
            </h3>
            
            <div className="space-y-3.5">
              {selectedNode.fields.map((field) => (
                <div 
                  key={field.id} 
                  className={`border rounded-xl p-3 space-y-2.5 transition-colors ${
                    field.visible 
                      ? 'border-border-default bg-bg-card' 
                      : 'border-border-subtle/50 bg-bg-subtle/40 opacity-70'
                  }`}
                >
                  {/* Field Header: Name & Visibility toggle */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase font-mono bg-bg-subtle border border-border-subtle px-1.5 py-0.5 rounded">
                        {field.type}
                      </span>
                      <span className="text-xs font-bold text-text-heading truncate max-w-[100px]">{field.name}</span>
                    </div>

                    <button
                      onClick={() => updateComponentFieldVisibility(selectedNode.id, field.id, !field.visible)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        field.visible 
                          ? 'border-primary/20 text-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border-default text-text-muted hover:bg-bg-subtle'
                      }`}
                      aria-label="Toggle Visibility"
                    >
                      {field.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Field Input (only show if visible) */}
                  {field.visible && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Edit3 className="h-3 w-3" />
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateComponentFieldLabel(selectedNode.id, field.id, e.target.value)}
                        className="w-full bg-bg-subtle border border-border-default focus:border-primary focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-semibold text-text-heading"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PropsPanel;
