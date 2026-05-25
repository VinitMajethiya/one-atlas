'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

export function OfflineState() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!window.navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-accent-pink text-white text-center py-2.5 px-4 shadow-md flex items-center justify-center gap-3 animate-slide-in font-sans">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-white animate-pulse" />
        <span className="text-xs font-bold font-mono uppercase tracking-wider">
          Connection Interrupted
        </span>
      </div>
      <span className="hidden md:inline text-xs font-semibold text-white/90">
        You are currently viewing OneAtlas in offline mode. Live deploy pipelines may pause.
      </span>
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') {
            setIsOffline(!window.navigator.onLine);
          }
        }}
        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[10px] font-mono px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ml-3"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Check Status</span>
      </button>
    </div>
  );
}

export default OfflineState;
