'use client';

import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { getAllGames } from '@/lib/gamesData';
import Link from 'next/link';

// Appwrite Setup
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const TOURNAMENTS_COLLECTION_ID = 'tournaments';

interface PdfUrl {
  title: string;
  url: string;
}

export default function TournamentRulesAdminPage() {
  const { user, profile } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [rulesTitle, setRulesTitle] = useState('');
  const [pdfUrls, setPdfUrls] = useState<PdfUrl[]>([]);

  // Check if user is admin
  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(DB_ID, TOURNAMENTS_COLLECTION_ID);
      setTournaments(response.documents);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tournaments:', err);
      setError(err.message || 'Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Load tournament rules
  const loadTournamentRules = (tournament: any) => {
    setSelectedTournament(tournament);
    setRulesTitle(tournament.rulesTitle || `${tournament.gameName} Rules & Regulations`);
    
    // Parse PDF URLs from JSON strings
    let parsedPdfUrls: PdfUrl[] = [];
    if (tournament.pdfUrls && Array.isArray(tournament.pdfUrls)) {
      parsedPdfUrls = tournament.pdfUrls.map((pdfString: string) => {
        try {
          return JSON.parse(pdfString);
        } catch (error) {
          console.error('Error parsing PDF URL:', error);
          return { title: '', url: '' };
        }
      });
    }
    
    setPdfUrls(parsedPdfUrls);
  };

  // Save tournament rules
  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTournament) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Convert PDF URLs to JSON strings for storage
      const pdfUrlStrings = pdfUrls.map(pdf => JSON.stringify(pdf));
      
      await databases.updateDocument(
        DB_ID,
        TOURNAMENTS_COLLECTION_ID,
        selectedTournament.$id,
        { 
          rulesTitle,
          pdfUrls: pdfUrlStrings
        }
      );

      setSuccess('Tournament rules updated successfully!');
      await fetchTournaments();
      
    } catch (err: any) {
      console.error('Error saving tournament rules:', err);
      setError(err.message || 'Failed to save tournament rules');
    } finally {
      setSaving(false);
    }
  };

  // Add PDF URL
  const addPdfUrl = () => {
    setPdfUrls(prev => [...prev, { title: '', url: '' }]);
  };

  // Remove PDF URL
  const removePdfUrl = (index: number) => {
    setPdfUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Update PDF URL
  const updatePdfUrl = (index: number, field: keyof PdfUrl, value: string) => {
    setPdfUrls(prev => prev.map((pdf, i) => 
      i === index ? { ...pdf, [field]: value } : pdf
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c110d] mx-auto mb-4"></div>
          <p>Loading tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tournament Rules Management</h1>
            <p className="text-gray-400 mt-2">Add PDF rules documents from Google Drive</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/tournaments"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Tournaments
            </Link>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tournament Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Select Tournament</h2>
              <div className="space-y-3">
                {tournaments.map((tournament) => (
                  <button
                    key={tournament.$id}
                    onClick={() => loadTournamentRules(tournament)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedTournament?.$id === tournament.$id
                        ? 'bg-[#8c110d] border-[#8c110d] text-white'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{tournament.gameName}</div>
                    <div className="text-sm opacity-75">/{tournament.slug}</div>
                    <div className="text-xs mt-1">
                      Rules: {tournament.pdfUrls && tournament.pdfUrls.length > 0 ? `✅ ${tournament.pdfUrls.length} PDFs` : '❌ No PDFs'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rules Form */}
          <div className="lg:col-span-2">
            {selectedTournament ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">
                  Rules for {selectedTournament.gameName}
                </h2>
                
                <form onSubmit={handleSaveRules} className="space-y-6">
                  {/* Rules Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Rules Title</label>
                    <input
                      type="text"
                      value={rulesTitle}
                      onChange={(e) => setRulesTitle(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                      placeholder="e.g., PUBG Mobile Rules & Regulations"
                    />
                  </div>

                  
                  {/* PDF URLs */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium">PDF Documents (Google Drive URLs)</label>
                      <button
                        type="button"
                        onClick={addPdfUrl}
                        className="bg-[#8c110d] hover:bg-[#7a0f0b] px-4 py-2 rounded text-sm font-semibold"
                      >
                        Add PDF
                      </button>
                    </div>
                    
                    {pdfUrls.length === 0 && (
                      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
                        No PDF documents added yet. Click "Add PDF" to get started.
                      </div>
                    )}
                    
                    {pdfUrls.map((pdf, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold">PDF Document #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removePdfUrl(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Document Title</label>
                            <input
                              type="text"
                              value={pdf.title}
                              onChange={(e) => updatePdfUrl(index, 'title', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                              placeholder="e.g., Official Tournament Rules"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium mb-1">Google Drive PDF URL</label>
                            <input
                              type="url"
                              value={pdf.url}
                              onChange={(e) => updatePdfUrl(index, 'url', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                              placeholder="https://drive.google.com/file/d/..."
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              Make sure the PDF is publicly accessible or shared with view permissions
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#8c110d] hover:bg-[#7a0f0b] disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Rules'}
                    </button>
                    
                    {selectedTournament && (
                      <a
                        href={`/games/${selectedTournament.slug}/rules`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Preview Rules
                      </a>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold mb-4">No Tournament Selected</h2>
                <p className="text-gray-400">Select a tournament from the left to manage its rules.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}