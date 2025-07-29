import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-desert-sand bg-parchment flex items-center justify-center p-4">
          <div className="bg-desert-sand rounded-2xl border border-champagne-gold/30 shadow-luxury p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display text-rich-brown-800 font-bold mb-4">
              Something went wrong
            </h2>
            <p className="text-warm-grey-600 font-body mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-burnt-gradient text-desert-sand font-body font-semibold py-3 px-6 rounded-xl hover:shadow-desert-shadow transition-all duration-200 hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const DataErrorFallback: React.FC<{ 
  error: string; 
  onRetry?: () => void;
  title?: string;
}> = ({ 
  error, 
  onRetry, 
  title = "Failed to load data" 
}) => (
  <div className="bg-desert-sand rounded-xl border border-red-400/30 p-6 text-center">
    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
    <h3 className="text-rich-brown-800 font-body font-semibold mb-2">{title}</h3>
    <p className="text-warm-grey-600 text-sm mb-4">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-500 text-white font-body font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
);