'use client';

import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import TopBar from './TopBar';
import ComponentTree from './ComponentTree';
import CanvasPanel from './CanvasPanel';
import PropsPanel from './PropsPanel';
import ConversationalInput from './ConversationalInput';
import BottomBar from './BottomBar';
import { FolderTree, Laptop, Sliders } from 'lucide-react';

export function BuilderLayout() {
  const { 
    leftPanelOpen, rightPanelOpen, activeTab, setActiveTab 
  } = useBuilderStore();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-default">
      {/* Top Bar */}
      <TopBar />

      {/* Main Body */}
      <div className="flex flex-grow overflow-hidden relative">
        
        {/* ---------------------------------------------------- */}
        {/* DESKTOP SIDEBARS & PANELS (Hidden on Mobile/Tablet)  */}
        {/* ---------------------------------------------------- */}

        {/* Left Sidebar: Component Tree */}
        <aside 
          className={`hidden lg:block w-64 border-r border-border-default overflow-y-auto shrink-0 transition-all ${
            leftPanelOpen ? 'translate-x-0' : '-translate-x-full absolute pointer-events-none'
          }`}
        >
          <ComponentTree />
        </aside>

        {/* Middle Area: Canvas & Chat (Responsive) */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Mobile Tab View Router */}
          <div className="flex-1 overflow-hidden flex flex-col lg:hidden">
            {activeTab === 'tree' && (
              <div className="flex-grow overflow-y-auto">
                <ComponentTree />
              </div>
            )}
            
            {activeTab === 'canvas' && (
              <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <CanvasPanel />
                </div>
                <ConversationalInput />
              </div>
            )}
            
            {activeTab === 'props' && (
              <div className="flex-grow overflow-y-auto">
                <PropsPanel />
              </div>
            )}
          </div>

          {/* Desktop Canvas & Chat View (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto">
              <CanvasPanel />
            </div>
            <ConversationalInput />
          </div>

        </main>

        {/* Right Sidebar: Props Editor */}
        <aside 
          className={`hidden lg:block w-72 border-l border-border-default overflow-y-auto shrink-0 transition-all ${
            rightPanelOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 pointer-events-none'
          }`}
        >
          <PropsPanel />
        </aside>

      </div>

      {/* Mobile Tab Switcher Bar (Visible on Mobile/Tablet) */}
      <div className="lg:hidden h-14 border-t border-border-default bg-bg-card flex items-center justify-around px-4 shrink-0 relative z-20">
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'tree' ? 'text-primary scale-105' : 'text-text-muted hover:text-primary'
          }`}
        >
          <FolderTree className="h-4.5 w-4.5" />
          <span>Tree</span>
        </button>
        
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'canvas' ? 'text-primary scale-105' : 'text-text-muted hover:text-primary'
          }`}
        >
          <Laptop className="h-4.5 w-4.5" />
          <span>Canvas</span>
        </button>
        
        <button
          onClick={() => setActiveTab('props')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'props' ? 'text-primary scale-105' : 'text-text-muted hover:text-primary'
          }`}
        >
          <Sliders className="h-4.5 w-4.5" />
          <span>Properties</span>
        </button>
      </div>

      {/* Bottom status bar */}
      <BottomBar />
    </div>
  );
}

export default BuilderLayout;
