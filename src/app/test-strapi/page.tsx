'use client';

import { useState, useEffect } from 'react';
import StrapiTest from '@/components/StrapiTest';

interface StrapiResponse {
  data: any;
  meta?: any;
  error?: any;
}

export default function TestStrapiPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [responseData, setResponseData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    testStrapiConnection();
  }, []);

  const testStrapiConnection = async () => {
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
      
      if (!strapiUrl) {
        throw new Error('NEXT_PUBLIC_STRAPI_URL is not configured');
      }

      console.log('Testing connection to:', strapiUrl);

      // Test basic connection to Strapi
      const response = await fetch(`${strapiUrl}/api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseData(data);
      setConnectionStatus('success');
      
    } catch (error: any) {
      console.error('Strapi connection error:', error);
      setErrorMessage(error.message);
      setConnectionStatus('error');
    }
  };

  const testWithToken = async () => {
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
      const apiToken = process.env.STRAPI_API_TOKEN;
      
      if (!strapiUrl) {
        throw new Error('NEXT_PUBLIC_STRAPI_URL is not configured');
      }

      if (!apiToken) {
        throw new Error('STRAPI_API_TOKEN is not configured');
      }

      const response = await fetch(`${strapiUrl}/api/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseData(data);
      setConnectionStatus('success');
      
    } catch (error: any) {
      console.error('Strapi API error:', error);
      setErrorMessage(error.message);
      setConnectionStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Strapi Backend Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          
          <div className="mb-4">
            <strong>Strapi URL:</strong> {process.env.NEXT_PUBLIC_STRAPI_URL || 'Not configured'}
          </div>
          
          <div className="mb-4">
            <strong>API Token:</strong> {process.env.STRAPI_API_TOKEN ? 'Configured' : 'Not configured'}
          </div>
          
          <div className="flex items-center mb-4">
            <strong className="mr-2">Status:</strong>
            {connectionStatus === 'loading' && (
              <span className="text-yellow-600">🔄 Testing connection...</span>
            )}
            {connectionStatus === 'success' && (
              <span className="text-green-600">✅ Connected successfully!</span>
            )}
            {connectionStatus === 'error' && (
              <span className="text-red-600">❌ Connection failed</span>
            )}
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testStrapiConnection}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Test Basic Connection
            </button>
            <button
              onClick={testWithToken}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Test with API Token
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          {responseData && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h3 className="text-gray-800 font-semibold mb-2">Response Data:</h3>
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure your Strapi backend is deployed and running on Render</li>
            <li>Access your Strapi admin panel at: <code className="bg-gray-100 px-2 py-1 rounded">https://kuer-strapi-backend.onrender.com/admin</code></li>
            <li>Create an admin user account</li>
            <li>Go to Settings → API Tokens → Create new API Token</li>
            <li>Copy the token and update your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file</li>
            <li>Create content types (like Articles, Blog Posts) in Strapi</li>
            <li>Set permissions for public access in Settings → Users & Permissions → Roles → Public</li>
          </ol>
        </div>

        {/* Live Data Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Live Data Test</h2>
          <StrapiTest />
        </div>
      </div>
    </div>
  );
}