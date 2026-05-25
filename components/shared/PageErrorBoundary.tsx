'use client';
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class PageErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-8 text-center text-text-muted">
          <p className="text-sm font-mono">Something went wrong.</p>
          <button onClick={() => this.setState({ hasError: false })} 
            className="mt-4 text-xs text-primary underline">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
