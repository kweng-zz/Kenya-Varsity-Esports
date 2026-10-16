'use client';

import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';

interface RankingEntry {
  rank: number;
  playerName: string;
  university: string;
  wins: number;
  losses: number;
  points: number;
  image?: string;
}

interface BulkRankingsImporterProps {
  onImport: (rankings: RankingEntry[]) => void;
  onClose: () => void;
}

export const BulkRankingsImporter: React.FC<BulkRankingsImporterProps> = ({ onImport, onClose }) => {
  const [importMethod, setImportMethod] = useState<'csv' | 'json'>('csv');
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<RankingEntry[]>([]);

  const toInt = (value: string | undefined | number) => parseInt(String(value ?? 0), 10) || 0;

  const parseCSV = (text: string): RankingEntry[] => {
    const lines = text.trim().split('\n').filter((line) => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const requiredFields = ['rank', 'playername', 'university'];
    const missingFields = requiredFields.filter((field) => !headers.includes(field));
    if (missingFields.length > 0) {
      throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
    }

    // Accept both "points" and the legacy "total" column for the score
    const scoreKey = headers.includes('points') ? 'points' : headers.includes('total') ? 'total' : null;
    const idx = (key: string) => headers.indexOf(key);

    const rankings: RankingEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const playerName = values[idx('playername')];
      if (!playerName) continue;

      rankings.push({
        rank: toInt(values[idx('rank')]) || i,
        playerName,
        university: values[idx('university')] || '',
        wins: idx('wins') >= 0 ? toInt(values[idx('wins')]) : 0,
        losses: idx('losses') >= 0 ? toInt(values[idx('losses')]) : 0,
        points: scoreKey && idx(scoreKey) >= 0 ? toInt(values[idx(scoreKey)]) : 0,
        image: idx('image') >= 0 ? values[idx('image')] : undefined,
      });
    }

    if (rankings.length === 0) {
      throw new Error('No valid rows found in CSV data');
    }
    return rankings;
  };

  const parseJSON = (text: string): RankingEntry[] => {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of ranking objects');
    }

    return data.map((item, index) => ({
      rank: item.rank || index + 1,
      playerName: item.playerName || item.squadName || '',
      university: item.university || '',
      wins: toInt(item.wins),
      losses: toInt(item.losses),
      points: toInt(item.points ?? item.total),
      image: item.image,
    }));
  };

  const handlePreview = () => {
    try {
      setError(null);
      let rankings: RankingEntry[] = [];

      if (importMethod === 'csv') {
        if (!csvText.trim()) throw new Error('Please paste CSV data');
        rankings = parseCSV(csvText);
      } else {
        if (!jsonText.trim()) throw new Error('Please paste JSON data');
        rankings = parseJSON(jsonText);
      }

      if (rankings.some((r) => !r.playerName)) {
        throw new Error('Every entry needs a player name');
      }

      setPreview(rankings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data');
      setPreview([]);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setError('Please preview data first');
      return;
    }
    onImport(preview);
  };

  const downloadTemplate = () => {
    const csvTemplate = `rank,playerName,university,wins,losses,points,image
1,PLAYER NAME,UNIVERSITY,24,0,72,/images/game.png
2,ANOTHER PLAYER,ANOTHER UNI,20,2,68,/images/game.png
3,THIRD PLAYER,THIRD UNI,18,4,64,/images/game.png`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvTemplate));
    element.setAttribute('download', 'rankings_template.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJSONTemplate = () => {
    const jsonTemplate = [
      { rank: 1, playerName: 'PLAYER NAME', university: 'UNIVERSITY', wins: 24, losses: 0, points: 72, image: '/images/game.png' },
      { rank: 2, playerName: 'ANOTHER PLAYER', university: 'ANOTHER UNI', wins: 20, losses: 2, points: 68, image: '/images/game.png' },
    ];

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonTemplate, null, 2)));
    element.setAttribute('download', 'rankings_template.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-700 px-6 py-4 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Bulk Import Rankings</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Import Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Import Method</label>
            <div className="flex gap-4">
              {(['csv', 'json'] as const).map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    checked={importMethod === method}
                    onChange={() => {
                      setImportMethod(method);
                      setError(null);
                      setPreview([]);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300 uppercase">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* CSV Import */}
          {importMethod === 'csv' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Paste CSV Data</label>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="rank,playerName,university,wins,losses,points,image&#10;1,PLAYER NAME,UNIVERSITY,24,0,72,/images/game.png"
                className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 font-mono text-sm"
              />
              <p className="text-xs text-gray-400">
                Required columns: rank, playerName, university. Optional: wins, losses, points
                (a legacy &quot;total&quot; column is also accepted), image.
              </p>
            </div>
          )}

          {/* JSON Import */}
          {importMethod === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Paste JSON Data</label>
                <button
                  onClick={downloadJSONTemplate}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='[{"rank": 1, "playerName": "PLAYER", "university": "UNI", "wins": 24, "losses": 0, "points": 72}]'
                className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 font-mono text-sm"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-4 bg-red-900/20 border border-red-600/30 rounded">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">
                Preview ({preview.length} entries) — importing replaces the current list in the editor
              </h3>
              <div className="overflow-x-auto bg-gray-700 rounded border border-gray-600">
                <table className="w-full text-sm">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium">Rank</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Player Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">University</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Wins</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Losses</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {preview.slice(0, 5).map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-600">
                        <td className="px-3 py-2">{entry.rank}</td>
                        <td className="px-3 py-2">{entry.playerName}</td>
                        <td className="px-3 py-2">{entry.university}</td>
                        <td className="px-3 py-2">{entry.wins}</td>
                        <td className="px-3 py-2">{entry.losses}</td>
                        <td className="px-3 py-2">{entry.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 5 && (
                <p className="text-xs text-gray-400">... and {preview.length - 5} more entries</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-600">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePreview}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Preview
            </button>
            {preview.length > 0 && (
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import {preview.length} Entries
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
