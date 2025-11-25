'use client';

import React, { useState } from 'react';
import { mailchimpService } from '@/lib/mailchimp';

export default function MailchimpDebug() {
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testConfiguration = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY || process.env.MAILCHIMP_API_KEY;
      const server = process.env.NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX || process.env.MAILCHIMP_SERVER_PREFIX;
      const audienceId = process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID || process.env.MAILCHIMP_AUDIENCE_ID;

      const connectionTest = await mailchimpService.testConnection();
      
      setDebugInfo({
        environment: {
          apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found',
          server,
          audienceId,
          hasApiKey: !!apiKey,
          hasServer: !!server,
          hasAudienceId: !!audienceId,
        },
        connectionTest
      });
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Mailchimp Debug</h3>
      <button
        onClick={testConfiguration}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Configuration'}
      </button>
      
      {debugInfo && (
        <div className="mt-4 p-4 bg-gray-700 rounded">
          <pre className="text-sm">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}