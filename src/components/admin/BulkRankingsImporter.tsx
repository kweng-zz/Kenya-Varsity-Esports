'use client';

import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';

interface RankingEntry {
  rank: number;
  playerName: string;
  university: string;
  wins: number;
  losses: number;
  total: number;
  image?: string;
}

interface BulkRankingsImporterProps {
  onImport: (rankings: RankingEntry[]) => void;
  onClose: () => void;
}

export const BulkRankingsImporter: React.FC<BulkRankingsImporterProps> = ({ onImport, onClose }) => {
  const [importMethod, setImportMethod] = useState<'csv' | 'json' | 'manual'>('csv');
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<RankingEntry[]>([]);

  const parseCSV = (text: string): RankingEntry[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const requiredFields = ['rank', 'playername', 'university', 'wins', 'losses', 'total'];
    
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
      throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
    }

    const rankings: RankingEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < requiredFields.length) continue;

      const rankIdx = headers.indexOf('rank');
      const playerIdx = headers.indexOf('playername');
      const univIdx = headers.indexOf('university');
      const winsIdx = headers.indexOf('wins');
      const lossesIdx = headers.indexOf('losses');
      const totalIdx = headers.indexOf('total');
      const imageIdx = headers.indexOf('image');

      rankings.push({
        rank: parseInt(values[rankIdx]) || i,
        playerName: values[playerIdx],
        university: values[univIdx],
        wins: parseInt(values[winsIdx]) || 0,
        losses: parseInt(values[lossesIdx]) || 0,
        total: parseInt(values[totalIdx]) || 0,
        image: imageIdx >= 0 ? values[imageIdx] : undefined
      });
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
      wins: parseInt(item.wins) || 0,
      losses: parseInt(item.losses) || 0,
      total: parseInt(item.total) || 0,
      image: item.image
    }));
  };

  const handlePreview = () => {
    try {
      setError(null);
      let rankings: RankingEntry[] = [];

      if (importMethod === 'csv') {
        if (!csvText.trim()) {
          throw new Error('Please paste CSV data');
        }
        rankings = parseCSV(csvText);
      } else if (importMethod === 'json') {
        if (!jsonText.trim()) {
          throw new Error('Please paste JSON data');
        }
        rankings = parseJSON(jsonText);
      }

      if (rankings.length === 0) {
        throw new Error('No valid rankings found');
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
    const csvTemplate = `rank,playerName,university,wins,losses,total,image
1,SQUAD NAME,UNIVERSITY,24,0,72,/images/game.png
2,ANOTHER SQUAD,ANOTHER UNI,20,2,68,/images/game.png
3,THIRD SQUAD,THIRD UNI,18,4,64,/images/game.png`;

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
      {
        rank: 1,
        playerName: 'SQUAD NAME',
        university: 'UNIVERSITY',
        wins: 24,
        losses: 0,
        total: 72,
        image: '/images/game.png'
      },
      {
        rank: 2,
        playerName: 'ANOTHER SQUAD',
        university: 'ANOTHER UNI',
        wins: 20,
        losses: 2,
        total: 68,
        image: '/images/game.png'
      }
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
        <div className="sticky top-0 bg-gray-700 px-6 py-4 border-b border-gray-600">
          <h2 className="text-2xl font-bold">Bulk Import Rankings</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Import Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Import Method</label>
            <div className="flex gap-4">
              {(['csv', 'json', 'manual'] as const).map(method => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    checked={importMethod === method}
                    onChange={(e) => {
                      setImportMethod(e.target.value as typeof method);
                      setError(null);
                      setPreview([]);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300 capitalize">{method === 'csv' ? 'CSV' : method === 'json' ? 'JSON' : 'Manual Entry'}</span>
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
                placeholder="rank,playerName,university,wins,losses,total,image&#10;1,SQUAD NAME,UNIVERSITY,24,0,72,/images/game.png"
                className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 font-mono text-sm"
              />
              <p className="text-xs text-gray-400">
                Required columns: rank, playerName, university, wins, losses, total. Optional: image
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
                placeholder='[{"rank": 1, "playerName": "SQUAD", "university": "UNI", "wins": 24, "losses": 0, "total": 72}]'
                className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 font-mono text-sm"
              />
            </div>
          )}

          {/* Manual Entry */}
          {importMethod === 'manual' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Use the "Add Ranking Entry" button in the main editor to manually add rankings one by one.
              </p>
              <div className="bg-gray-700 p-4 rounded border border-gray-600">
                <p className="text-sm text-gray-300">
                  This method is best for adding a few rankings. For bulk imports, use CSV or JSON.
                </p>
              </div>
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
              <h3 className="text-sm font-medium text-gray-300">Preview ({preview.length} entries)</h3>
              <div className="overflow-x-auto bg-gray-700 rounded border border-gray-600">
                <table className="w-full text-sm">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium">Rank</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Player Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">University</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Wins</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Losses</th>
                      <th className="px-3 py-2 text-left text-xs font-medium">Total</th>
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
                        <td className="px-3 py-2">{entry.total}</td>
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
            {importMethod !== 'manual' && (
              <button
                onClick={handlePreview}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Preview
              </button>
            )}
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
