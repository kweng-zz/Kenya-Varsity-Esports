'use client';
import React, { useState } from 'react';
export const PDFViewer = ({ pdfUrl, title }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFlipping, setIsFlipping] = useState(false);
    // Convert Google Drive URL to embeddable format
    const getEmbedUrl = (url) => {
        if (url.includes('drive.google.com')) {
            const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            if (fileId) {
                return `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }
        return url;
    };
    const embedUrl = getEmbedUrl(pdfUrl);
    const handlePageFlip = (direction) => {
        if (isFlipping)
            return;
        setIsFlipping(true);
        if (direction === 'next') {
            setCurrentPage(prev => prev + 1);
        }
        else {
            setCurrentPage(prev => Math.max(1, prev - 1));
        }
        // Reset flip animation after animation completes
        setTimeout(() => {
            setIsFlipping(false);
        }, 600);
    };
    return (<div className="w-full">
      {/* PDF Book Container */}
      <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 shadow-2xl">
        {/* Book Spine Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-800 to-amber-600 rounded-l-lg shadow-inner"></div>
        
        {/* Book Pages Container */}
        <div className="relative bg-white rounded-r-lg shadow-lg overflow-hidden min-h-[600px]">
          {/* Page Flip Animation Overlay */}
          {isFlipping && (<div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-white origin-left transform transition-transform duration-600 ease-in-out" style={{
                transform: isFlipping ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d'
            }}>
                <div className="absolute inset-0 bg-gradient-to-l from-gray-200 to-white shadow-xl"></div>
              </div>
            </div>)}
          
          {/* PDF Embed */}
          <div className="relative z-10 w-full h-[600px]">
            {isLoading && (<div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c110d] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading document...</p>
                </div>
              </div>)}
            
            {error && (<div className="absolute inset-0 flex items-center justify-center bg-red-50">
                <div className="text-center p-8">
                  <div className="text-red-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Document</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Open in New Tab
                  </a>
                </div>
              </div>)}
            
            <iframe src={embedUrl} className="w-full h-full border-0 rounded-r-lg" title={title} onLoad={() => setIsLoading(false)} onError={() => {
            setIsLoading(false);
            setError('Failed to load PDF document. Please try opening it in a new tab.');
        }}/>
          </div>
          
          {/* Page Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
            <div className="flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3">
              <button onClick={() => handlePageFlip('prev')} disabled={currentPage <= 1 || isFlipping} className="flex items-center gap-2 px-4 py-2 bg-[#8c110d] hover:bg-[#b91c17] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Previous
              </button>
              
              <div className="flex items-center gap-2 text-white text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-full">
                  Page {currentPage}
                </span>
              </div>
              
              <button onClick={() => handlePageFlip('next')} disabled={isFlipping} className="flex items-center gap-2 px-4 py-2 bg-[#8c110d] hover:bg-[#b91c17] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Book Shadow */}
        <div className="absolute -bottom-2 -right-2 left-4 h-4 bg-black/20 rounded-lg blur-sm"></div>
      </div>
      
      {/* Document Info */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          📖 Interactive document viewer • Click navigation buttons to flip pages
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Open Full Screen
          </a>
          <a href={pdfUrl} download className="inline-flex items-center gap-2 px-4 py-2 bg-[#8c110d] hover:bg-[#b91c17] text-white rounded-lg transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download PDF
          </a>
        </div>
      </div>
    </div>);
};
