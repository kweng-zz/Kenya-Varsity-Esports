'use client';

import { useState, useEffect } from 'react';
import { strapi } from '@/lib/strapi';

interface Article {
  id: number;
  attributes: {
    title: string;
    content: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function StrapiTest() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch articles from Strapi
      const response = await strapi.find<Article>('articles', {
        populate: '*',
        sort: ['publishedAt:desc'],
        pagination: {
          pageSize: 10,
        },
      });

      setArticles(response.data);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading articles from Strapi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <h3 className="text-red-800 font-semibold mb-2">Error loading articles:</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchArticles}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Articles from Strapi ({articles.length})
        </h2>
        <button
          onClick={fetchArticles}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-yellow-800 font-semibold mb-2">No articles found</h3>
          <p className="text-yellow-700 mb-4">
            It looks like there are no articles in your Strapi backend yet.
          </p>
          <div className="text-sm text-yellow-600">
            <p className="mb-2">To add articles:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your Strapi admin panel</li>
              <li>Create an "Article" content type</li>
              <li>Add some sample articles</li>
              <li>Set permissions for public access</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {article.attributes.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.attributes.content}
              </p>
              <div className="text-sm text-gray-500">
                <p>Published: {new Date(article.attributes.publishedAt).toLocaleDateString()}</p>
                <p>ID: {article.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}