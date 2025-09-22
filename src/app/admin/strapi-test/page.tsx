'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface TestResponse {
  timestamp: string;
  environment: {
    STRAPI_URL: string;
    hasApiToken: boolean;
    nodeEnv: string;
  };
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    overallStatus: 'pass' | 'fail' | 'warning';
  };
}

export default function StrapiTestPage() {
  const { user, profile, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testSlug, setTestSlug] = useState('');

  const runTests = async () => {
    setIsRunning(true);
    try {
      const url = testSlug ? `/api/strapi/test?slug=${encodeURIComponent(testSlug)}` : '/api/strapi/test';
      const response = await fetch(url);
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults({
        timestamp: new Date().toISOString(),
        environment: {
          STRAPI_URL: 'Unknown',
          hasApiToken: false,
          nodeEnv: 'Unknown'
        },
        tests: [{
          name: 'Test Runner',
          status: 'fail',
          message: `Failed to run tests: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        summary: {
          total: 1,
          passed: 0,
          failed: 1,
          warnings: 0,
          overallStatus: 'fail'
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400 bg-green-400/10';
      case 'fail': return 'text-red-400 bg-red-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading admin panel...
      </div>
    );
  }

  // Unauthorized access
  if (!profile?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <Link href="/admin" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Strapi Connection Test</h1>
            <p className="text-gray-400">Diagnose Strapi blog integration issues</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Back to Admin
          </Link>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Run Diagnostics</h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Test Specific Slug (Optional)</label>
              <input
                type="text"
                value={testSlug}
                onChange={(e) => setTestSlug(e.target.value)}
                placeholder="e.g., test-article"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Test Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{testResults.summary.passed}</div>
                  <div className="text-sm text-gray-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{testResults.summary.failed}</div>
                  <div className="text-sm text-gray-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{testResults.summary.warnings}</div>
                  <div className="text-sm text-gray-400">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{testResults.summary.total}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg text-center font-medium ${getStatusColor(testResults.summary.overallStatus)}`}>
                Overall Status: {testResults.summary.overallStatus.toUpperCase()}
              </div>
            </div>

            {/* Environment Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Environment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Strapi URL:</span>
                  <p className="font-mono">{testResults.environment.STRAPI_URL}</p>
                </div>
                <div>
                  <span className="text-gray-400">API Token:</span>
                  <p className={testResults.environment.hasApiToken ? 'text-green-400' : 'text-red-400'}>
                    {testResults.environment.hasApiToken ? 'Configured' : 'Missing'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Environment:</span>
                  <p className="font-mono">{testResults.environment.nodeEnv}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Test run at: {new Date(testResults.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Individual Test Results */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Test Results</h2>
              <div className="space-y-4">
                {testResults.tests.map((test, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span>{getStatusIcon(test.status)}</span>
                        {test.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">{test.message}</p>
                    {test.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-gray-400 hover:text-white">
                          Show Details
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Troubleshooting Tips</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <div>
                    <strong>Connection Failed:</strong> Ensure Strapi is running with <code className="bg-gray-700 px-1 rounded">cd kuer && npm run develop</code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <div>
                    <strong>No Articles Found:</strong> Create test articles in Strapi admin panel and ensure they are published
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <div>
                    <strong>Permission Errors:</strong> Check Strapi Settings → Users & Permissions → Public role has Article and Upload permissions
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <div>
                    <strong>Slug Not Found:</strong> Verify the article slug in Strapi admin matches exactly (no spaces, special characters)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/blogs"
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-center"
            >
              <div className="text-lg font-semibold mb-2">Blog Management</div>
              <div className="text-sm text-gray-400">Create and manage articles</div>
            </Link>
            <a
              href={testResults?.environment.STRAPI_URL + '/admin' || 'http://localhost:1337/admin'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-center"
            >
              <div className="text-lg font-semibold mb-2">Strapi Admin</div>
              <div className="text-sm text-gray-400">Open Strapi admin panel</div>
            </a>
            <Link
              href="/blogs"
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-center"
            >
              <div className="text-lg font-semibold mb-2">View Blog</div>
              <div className="text-sm text-gray-400">See the public blog page</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}