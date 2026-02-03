'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log web vitals to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Web Vital:', metric);
    }
    
    // In production, we could send this to a monitoring endpoint
    // sendToAnalytics(metric);
  });

  return null;
}
