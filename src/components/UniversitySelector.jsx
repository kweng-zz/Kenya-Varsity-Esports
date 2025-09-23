'use client';
import React, { useState, useMemo } from 'react';
export const UniversitySelector = ({ universities, supportContact, contactType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Filter universities based on search term
    const filteredUniversities = useMemo(() => {
        if (!searchTerm.trim())
            return universities;
        const searchLower = searchTerm.toLowerCase();
        return universities.filter(university => university.name.toLowerCase().includes(searchLower) ||
            (university.shortName && university.shortName.toLowerCase().includes(searchLower)));
    }, [universities, searchTerm]);
    const handleUniversitySelect = (university) => {
        setSelectedUniversity(university);
        setSearchTerm('');
        setIsDropdownOpen(false);
    };
    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };
    const handleInputBlur = () => {
        // Delay closing to allow clicking on dropdown items
        setTimeout(() => setIsDropdownOpen(false), 200);
    };
    const handleJoinGroup = () => {
        if (selectedUniversity) {
            window.open(selectedUniversity.whatsappLink, '_blank');
        }
    };
    const handleContactSupport = () => {
        if (contactType === 'whatsapp') {
            window.open(supportContact, '_blank');
        }
        else {
            window.location.href = `mailto:${supportContact}`;
        }
    };
    return (<div className="max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="university-search" className="block text-sm font-medium text-gray-300 mb-2">
          Search for your university ({universities.length} available)
        </label>
        <div className="relative">
          <input id="university-search" type="text" placeholder="Click here or start typing to search universities..." value={searchTerm} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {isDropdownOpen ? 'Select a university from the list below' : 'Click the input field to see available universities'}
        </p>
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && !selectedUniversity && (<div className="mb-6 max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg">
          {filteredUniversities.length > 0 ? (<ul className="divide-y divide-gray-700">
              {filteredUniversities.slice(0, searchTerm ? filteredUniversities.length : 10).map((university, index) => (<li key={index}>
                  <button onClick={() => handleUniversitySelect(university)} className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors focus:outline-none focus:bg-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{university.name}</span>
                      {university.shortName && (<span className="text-gray-400 text-sm">({university.shortName})</span>)}
                    </div>
                  </button>
                </li>))}
              {!searchTerm && filteredUniversities.length > 10 && (<li className="px-4 py-3 text-center text-gray-400 text-sm">
                  Start typing to see more universities...
                </li>)}
            </ul>) : searchTerm ? (<div className="px-4 py-8 text-center text-gray-400">
              <p>No universities found matching "{searchTerm}"</p>
              <p className="text-sm mt-2">
                Can't find your university? 
                <button onClick={handleContactSupport} className="text-red-400 hover:text-red-300 ml-1 underline">
                  Contact support
                </button>
              </p>
            </div>) : (<div className="px-4 py-8 text-center text-gray-400">
              <p>Loading universities...</p>
            </div>)}
        </div>)}

      {/* Selected University */}
      {selectedUniversity && (<div className="mb-6 p-6 bg-gray-800 border border-gray-600 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-2">Selected University</h4>
          <div className="flex justify-between items-center mb-4">
            <span className="text-white">{selectedUniversity.name}</span>
            {selectedUniversity.shortName && (<span className="text-gray-400">({selectedUniversity.shortName})</span>)}
          </div>
          
          <div className="flex gap-3">
            <button onClick={handleJoinGroup} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Join WhatsApp Group
            </button>
            
            <button onClick={() => setSelectedUniversity(null)} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Change
            </button>
          </div>
        </div>)}

      {/* Instructions */}
      <div className="text-center text-gray-400">
        <p className="mb-2">
          {selectedUniversity
            ? "Click 'Join WhatsApp Group' to connect with your university community"
            : "Search and select your university to join the gaming community"}
        </p>
        <p className="text-sm">
          Don't see your university? 
          <button onClick={handleContactSupport} className="text-red-400 hover:text-red-300 ml-1 underline">
            Let us know
          </button>
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
    </div>);
};
