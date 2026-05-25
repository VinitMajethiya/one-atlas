'use client';

import React from 'react';
import { 
  Folder, Layout, Table, Columns, BarChart3, FileSpreadsheet, Navigation, 
  ChevronDown
} from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ComponentNode } from '../../types/builder';
import { builderNodeIconClass } from '@/lib/theme';

export function ComponentTree() {
  const { schema, selectedNodeId, selectNode } = useBuilderStore();

  if (!schema) return null;

  const getIcon = (type: string) => {
    const cls = `h-4 w-4 ${builderNodeIconClass(type)}`;
    switch (type) {
      case 'layout': return <Layout className={cls} />;
      case 'table': return <Table className={cls} />;
      case 'kanban': return <Columns className={cls} />;
      case 'chart': return <BarChart3 className={cls} />;
      case 'form': return <FileSpreadsheet className={cls} />;
      case 'nav': return <Navigation className={cls} />;
      default: return <Folder className={cls} />;
    }
  };

  const renderNode = (node: ComponentNode, depth = 0) => {
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="text-left select-none">
        <div
          onClick={() => selectNode(node.id)}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          className={`flex items-center justify-between h-9 text-xs font-semibold hover:bg-bg-subtle cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-primary/10 text-primary border-l-2 border-primary' 
              : 'text-text-heading border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {getIcon(node.type)}
            <span className="truncate">{node.name}</span>
          </div>
          {hasChildren && <ChevronDown className="h-3.5 w-3.5 text-text-muted mr-2" />}
        </div>
        
        {/* Render child nodes recursively */}
        {hasChildren && (
          <div className="border-l border-border-default/40 ml-4.5 mt-0.5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-bg-card">
      <div className="h-10 border-b border-border-subtle flex items-center px-4 font-bold text-xs text-text-muted uppercase tracking-wider select-none shrink-0 bg-bg-subtle/50">
        Schema Components
      </div>
      <div className="flex-grow overflow-y-auto py-2">
        {schema.components.map((comp) => renderNode(comp))}
      </div>
    </div>
  );
}

export default ComponentTree;
