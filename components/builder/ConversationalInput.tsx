'use client';

import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useBuilderStore } from '../../store/useBuilderStore';

export function ConversationalInput() {
  const params = useParams();
  const appId = params?.appId as string;

  const { schema, addConversationEntry, setSchema } = useBuilderStore();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  if (!schema) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === '' || !appId) return;

    const instruction = prompt.trim();
    setIsProcessing(true);
    setLastError(null);
    addConversationEntry(instruction);
    setPrompt('');

    try {
      const res = await fetch(`/api/apps/${appId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction }),
      });

      const json = await res.json();

      if (!res.ok) {
        setLastError(json.error?.message || 'Could not apply that instruction.');
        alert(json.error?.message || 'Could not apply that instruction.');
        return;
      }

      setSchema(json.data.schema);
    } catch {
      setLastError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border-t border-border-default bg-bg-card p-3 relative z-10">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
        <div className="relative flex-grow">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
          <input
            type="text"
            disabled={isProcessing}
            placeholder={
              isProcessing
                ? 'Compiling mutations and rebuilding layout state...'
                : 'Edit this app... e.g. "Rename dashboard title to AI CRM" or "Add fields"'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-bg-subtle border border-border-default hover:border-primary/20 focus:border-primary focus:outline-none rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:ring-4 focus:ring-primary/10 text-text-heading disabled:opacity-75 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing || prompt.trim() === ''}
          className="bg-primary hover:bg-primary-light text-white font-bold px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:bg-bg-subtle disabled:text-text-muted border border-transparent disabled:border-border-default"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="hidden sm:inline text-xs">{isProcessing ? 'Processing...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}

export default ConversationalInput;
