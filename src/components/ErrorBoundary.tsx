"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error boundary UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/30">
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-red-500/20 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              We encountered an unexpected error while loading this content. 
              Our team has been notified and is working to fix this issue.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors mb-4">
                  View Error Details (Development Only)
                </summary>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 overflow-auto">
                  <div className="mb-4">
                    <h4 className="text-red-400 font-semibold mb-2">Error:</h4>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Component Stack:</h4>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#961c18] to-[#c41e3a] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 text-gray-300 rounded-lg font-semibold hover:bg-gray-900/70 transition-all duration-300 border border-gray-700"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-12 p-6 bg-gray-900/30 rounded-xl border border-gray-800">
              <h3 className="text-white font-semibold mb-3">Need help?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                If this problem persists, you can try refreshing the page or contact our support team. 
                We're here to help you get back to enjoying our content.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                <a 
                  href="/contact" 
                  className="text-[#961c18] hover:text-[#c41e3a] transition-colors font-medium"
                >
                  Contact Support
                </a>
                <span className="text-gray-600">•</span>
                <a 
                  href="/blogs" 
                  className="text-[#961c18] hover:text-[#c41e3a] transition-colors font-medium"
                >
                  Browse Articles
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for easier wrapping of components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Minimal error boundary for less critical components
export const MinimalErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">This section could not be loaded. Please refresh the page.</span>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (command: string, action: string, options?: any) => void;
  }
}