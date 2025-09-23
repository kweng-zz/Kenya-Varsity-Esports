'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AUTHORIZED_TEAM_CAPTAINS, getAllCaptainsInfo } from '@/lib/teamCaptains';
export default function AdminTeamCaptainsSimplePage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    // Redirect if not admin
    if (!loading && (!user || !profile?.isAdmin)) {
        router.push('/admin');
        return null;
    }
    if (loading) {
        return (<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>);
    }
    const captainsInfo = getAllCaptainsInfo();
    const filteredCaptains = AUTHORIZED_TEAM_CAPTAINS.filter(captain => captain.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Team Captains List</h1>
          <button onClick={() => router.push('/admin')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
            Back to Admin
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">How Team Captain Access Works</h2>
          <div className="space-y-2 text-sm text-blue-200">
            <p>• Users can register for tournaments only if their <strong>full name</strong> matches a name in the authorized list below</p>
            <p>• The name comparison is case-insensitive (John Doe = john doe = JOHN DOE)</p>
            <p>• Names must match exactly with what users enter during registration</p>
            <p>• To add/remove captains, edit the file: <code className="bg-gray-800 px-2 py-1 rounded">src/lib/teamCaptains.ts</code></p>
            <p>• Administrators always have access to tournament registration regardless of this list</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input type="text" placeholder="Search team captains..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-[#961c18] mb-2">{captainsInfo.totalCaptains}</div>
            <div className="text-gray-400">Total Team Captains</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">{filteredCaptains.length}</div>
            <div className="text-gray-400">Filtered Results</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">{Object.keys(captainsInfo.gameSpecificCaptains).length}</div>
            <div className="text-gray-400">Games with Specific Captains</div>
          </div>
        </div>

        {/* Captains List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Authorized Team Captains</h2>
          
          {filteredCaptains.length === 0 ? (<div className="text-center py-8 text-gray-400">
              No team captains found matching your search.
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCaptains.map((captain, index) => (<div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-white">{captain}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Captain #{index + 1}
                  </div>
                </div>))}
            </div>)}
        </div>

        {/* Game Specific Captains */}
        {Object.keys(captainsInfo.gameSpecificCaptains).length > 0 && (<div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Game-Specific Captains</h2>
            <div className="space-y-4">
              {Object.entries(captainsInfo.gameSpecificCaptains).map(([game, captains]) => (<div key={game} className="border-l-4 border-[#961c18] pl-4">
                  <h3 className="font-semibold text-[#961c18] mb-2">{game}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {captains.map((captain, index) => (<div key={index} className="text-sm text-gray-300 bg-gray-700 rounded px-3 py-1">
                        {captain}
                      </div>))}
                  </div>
                </div>))}
            </div>
          </div>)}

        {/* Instructions for editing */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Managing Team Captains</h2>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">To Add New Team Captains:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open the file: <code className="bg-gray-700 px-2 py-1 rounded">src/lib/teamCaptains.ts</code></li>
                <li>Add the new captain&apos;s full name to the <code className="bg-gray-700 px-2 py-1 rounded">AUTHORIZED_TEAM_CAPTAINS</code> array</li>
                <li>Make sure the name matches exactly with how they register on the website</li>
                <li>Save the file and restart the development server</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">To Remove Team Captains:</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open the file: <code className="bg-gray-700 px-2 py-1 rounded">src/lib/teamCaptains.ts</code></li>
                <li>Remove or comment out the captain&apos;s name from the array</li>
                <li>Save the file and restart the development server</li>
              </ol>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4 mt-4">
              <p className="text-yellow-200">
                <strong>Important:</strong> Changes to the team captains list require a server restart to take effect. 
                In production, you&apos;ll need to redeploy the application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
