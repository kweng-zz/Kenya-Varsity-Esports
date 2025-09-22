'use client';

import React from 'react';

interface StrapiErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface StrapiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class StrapiErrorBoundary extends React.Component<
  StrapiErrorBoundaryProps,
  StrapiErrorBoundaryState
> {
  constructor(props: StrapiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): StrapiErrorBoundaryState {
    // Check if this is a Strapi-related error
    if (error.message.includes('Strapi') || 
        error.message.includes('content-manager') ||
        error.message.includes('404')) {
      return { hasError: true, error };
    }
    
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Strapi Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-gray-800 border border-yellow-600 rounded-lg p-4 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Content Loading Issue
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  There was an issue loading content from the backend. 
                  The page will continue to work with cached or fallback content.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
