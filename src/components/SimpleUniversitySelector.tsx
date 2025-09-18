'use client';

import React, { useState } from 'react';

interface University {
  name: string;
  whatsappLink: string;
  shortName?: string;
}

interface SimpleUniversitySelectorProps {
  universities: University[];
  supportContact: string;
}

export const SimpleUniversitySelector: React.FC<SimpleUniversitySelectorProps> = ({
  universities,
  supportContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  // Filter universities based on search term
  const filteredUniversities = universities.filter(
    university => 
      university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (university.shortName && university.shortName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setSearchTerm('');
  };

  const handleJoinGroup = () => {
    if (selectedUniversity) {
      window.open(selectedUniversity.whatsappLink, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search for your university ({universities.length} available)
        </label>
        <input
          type="text"
          placeholder="Type university name or abbreviation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* University List */}
      {searchTerm && (
        <div className="mb-6 max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg">
          {filteredUniversities.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {filteredUniversities.map((university, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleUniversitySelect(university)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors focus:outline-none focus:bg-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{university.name}</span>
                      {university.shortName && (
                        <span className="text-gray-400 text-sm">({university.shortName})</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <p>No universities found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Selected University */}
      {selectedUniversity && (
        <div className="mb-6 p-6 bg-gray-800 border border-gray-600 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-2">Selected University</h4>
          <div className="flex justify-between items-center mb-4">
            <span className="text-white">{selectedUniversity.name}</span>
            {selectedUniversity.shortName && (
              <span className="text-gray-400">({selectedUniversity.shortName})</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleJoinGroup}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Join WhatsApp Group
            </button>
            
            <button
              onClick={() => setSelectedUniversity(null)}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-gray-400">
        <p className="mb-2">
          {selectedUniversity 
            ? "Click 'Join WhatsApp Group' to connect with your university community"
            : "Search and select your university to join the gaming community"
          }
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-white">{universities.length}</div>
          <div className="text-sm text-gray-400">Universities</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-sm text-gray-400">Community Support</div>
        </div>
      </div>
    </div>
  );
};