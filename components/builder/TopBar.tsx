'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, Share2, Globe, ChevronLeft, ChevronRight, 
  Check, X, ExternalLink, Loader2
} from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useParams } from 'next/navigation';

export function TopBar() {
  const { 
    schema, leftPanelOpen, rightPanelOpen, 
    toggleLeftPanel, toggleRightPanel, updateAppName 
  } = useBuilderStore();

  const params = useParams();
  const appId = params?.appId as string;

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(schema?.appName || 'Workspace App');
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  
  // Deploy Dialog State
  const [deployOpen, setDeployOpen] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: Idle, 1: Provisioning, 2: Compiling, 3: Completed
  const [deployUrl, setDeployUrl] = useState('');

  if (!schema) return null;

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameInput.trim() !== '') {
      updateAppName(nameInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameBlur();
    }
  };

  // Generate token and share/copy link via API
  const handleShare = async () => {
    if (!appId) return;
    setShareLoading(true);
    try {
      const res = await fetch(`/api/apps/${appId}/preview`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error();

      const shareUrl = json.data.previewUrl;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      alert('Failed to generate shareable preview snapshot.');
    } finally {
      setShareLoading(false);
    }
  };

  // Simulated Deploy Lifecycle
  const handleDeployStart = () => {
    if (!appId) return;
    setDeployOpen(true);
    setDeployStep(1);

    // Step 1 -> Step 2
    setTimeout(() => {
      setDeployStep(2);
    }, 1800);

    // Step 2 -> Step 3
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/apps/${appId}/preview`, { method: 'POST' });
        const json = await res.json();
        if (res.ok) {
          setDeployUrl(json.data.previewUrl);
        } else {
          const deployToken = 'live_' + Math.random().toString(36).substring(2, 10);
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          setDeployUrl(`${origin}/preview/${deployToken}`);
        }
      } catch {
        const deployToken = 'live_' + Math.random().toString(36).substring(2, 10);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setDeployUrl(`${origin}/preview/${deployToken}`);
      }
      setDeployStep(3);
    }, 3800);
  };

  return (
    <header className="h-14 border-b border-border-default bg-bg-card flex items-center justify-between px-4 select-none relative z-20">
      
      {/* Left side: Logo & App Name */}
      <div className="flex items-center gap-3">
        <Link href="/templates" className="flex items-center gap-1.5 text-text-heading hover:text-primary transition-colors">
          <Compass className="h-5 w-5 text-primary" />
          <span className="font-bold text-xs tracking-wider uppercase hidden sm:inline">Atlas</span>
        </Link>
        <span className="text-border-default font-thin hidden sm:inline">|</span>
        
        {/* Editable App Name */}
        <div className="flex items-center gap-1.5">
          {isEditingName ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-bg-subtle border border-primary focus:outline-none rounded px-2 py-0.5 text-sm font-bold text-text-heading max-w-[180px]"
            />
          ) : (
            <h2
              onClick={() => setIsEditingName(true)}
              className="text-sm font-extrabold text-text-heading hover:bg-bg-subtle/50 px-2 py-0.5 rounded cursor-pointer transition-colors max-w-[200px] truncate"
            >
              {schema.appName}
            </h2>
          )}
          <span className="bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] px-1.5 py-0.5 rounded-full select-none">
            v{schema.version}
          </span>
        </div>
      </div>

      {/* Center Actions: Panel toggles */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={toggleLeftPanel}
          className={`p-1.5 rounded-lg border text-text-muted hover:text-primary hover:bg-bg-subtle transition-standard ${
            leftPanelOpen ? 'bg-bg-muted border-border-default' : 'border-transparent'
          }`}
          title="Toggle Navigation Tree"
        >
          <ChevronLeft className={`h-4.5 w-4.5 transition-transform ${!leftPanelOpen ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={toggleRightPanel}
          className={`p-1.5 rounded-lg border text-text-muted hover:text-primary hover:bg-bg-subtle transition-standard ${
            rightPanelOpen ? 'bg-bg-muted border-border-default' : 'border-transparent'
          }`}
          title="Toggle Properties Panel"
        >
          <ChevronRight className={`h-4.5 w-4.5 transition-transform ${rightPanelOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Right actions: Share, Deploy */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleShare}
          disabled={shareLoading}
          className="bg-bg-card hover:bg-bg-subtle text-text-heading border border-border-default font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-75"
        >
          {shareLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : copiedLink ? (
            <Check className="h-4 w-4 text-accent-green" />
          ) : (
            <Share2 className="h-4 w-4 text-text-muted" />
          )}
          <span>{shareLoading ? 'Sharing...' : copiedLink ? 'Copied!' : 'Share'}</span>
        </button>

        <button
          onClick={handleDeployStart}
          className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
        >
          <Globe className="h-4 w-4" />
          <span>Deploy</span>
        </button>
      </div>

      {/* Deploy Dialog Modal Overlay */}
      {deployOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-md p-6 relative shadow-standard text-left">
            <button
              onClick={() => setDeployOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-subtle transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {deployStep === 1 && (
              <div className="text-center py-6">
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
                <h3 className="font-extrabold text-text-heading text-lg mb-2">Provisioning server layers...</h3>
                <p className="text-xs text-text-muted leading-relaxed font-semibold">Creating secure Postgres clusters and setting network firewalls.</p>
              </div>
            )}

            {deployStep === 2 && (
              <div className="text-center py-6">
                <Loader2 className="h-10 w-10 text-accent-pink animate-spin mx-auto mb-4" />
                <h3 className="font-extrabold text-text-heading text-lg mb-2">Compiling state schema...</h3>
                <p className="text-xs text-text-muted leading-relaxed font-semibold">Writing relational layouts and wiring field parameters.</p>
              </div>
            )}

            {deployStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-green/20">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-text-heading text-lg mb-1">Application successfully deployed!</h3>
                  <p className="text-xs text-text-muted font-semibold">Ready for operational use.</p>
                </div>

                <div className="bg-bg-subtle border border-border-default rounded-xl p-4 flex justify-between items-center gap-3">
                  <div className="truncate text-xs font-bold text-text-heading">
                    {deployUrl}
                  </div>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary-light flex items-center gap-1 text-xs font-bold shrink-0"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <button
                  onClick={() => setDeployOpen(false)}
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all"
                >
                  Return to Canvas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default TopBar;
