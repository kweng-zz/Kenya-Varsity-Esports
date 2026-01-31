'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Client, Databases, Query } from 'appwrite';

// Appwrite Setup with lazy initialization
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for admin registrations');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for admin registrations');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin registrations:', error);
      return null;
    }
  }
  return { databases };
};

interface PlayerInfo {
  name: string;
  email: string;
  university: string;
  inGameId?: string;
  additionalInfo?: string;
}

interface TeamData {
  players: PlayerInfo[];
  substitutes: PlayerInfo[];
}

interface TournamentRegistration {
  $id: string;
  $createdAt: string;
  tournamentId: string;
  playerName: string;
  email: string;
  university?: string;
  teamName?: string;
  players?: string; // JSON string containing TeamData
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  userId: string;
}

interface Tournament {
  $id: string;
  gameName: string;
  title?: string;
  slug?: string;
}

export default function AdminRegistrationsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [tournaments, setTournaments] = useState<{ [key: string]: Tournament }>({});
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/admin');
    }
  }, [user, profile, loading, router]);

  // Fetch registrations and tournaments
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !profile?.isAdmin) return;

      try {
        const appwrite = initializeAppwrite();
        if (!appwrite?.databases) {
          console.warn('Appwrite not configured, skipping registrations fetch');
          setLoadingData(false);
          return;
        }

        // Fetch registrations
        const registrationsResponse = await appwrite.databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!,
          [Query.orderDesc('$createdAt'), Query.limit(100)]
        );

        const registrationsData = registrationsResponse.documents as unknown as TournamentRegistration[];
        setRegistrations(registrationsData);

        // Fetch tournament details for each unique tournament ID
        const tournamentIds = [...new Set(registrationsData.map(reg => reg.tournamentId))];
        console.log('🔍 Admin Registrations: Fetching tournaments for IDs:', tournamentIds);
        
        const tournamentPromises = tournamentIds.map(async (id) => {
          try {
            console.log(`🔍 Admin Registrations: Fetching tournament ${id}`);
            const tournament = await appwrite.databases!.getDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID!,
              id
            );
            console.log(`✅ Admin Registrations: Successfully fetched tournament ${id}:`, tournament.gameName);
            return tournament as unknown as Tournament;
          } catch (error) {
            console.error(`❌ Admin Registrations: Error fetching tournament ${id}:`, error);
            console.error(`❌ Admin Registrations: Error details:`, {
              message: error instanceof Error ? error.message : 'Unknown error',
              code: (error as any)?.code,
              type: (error as any)?.type,
              tournamentId: id
            });
            return null;
          }
        });

        const tournamentResults = await Promise.all(tournamentPromises);
        const tournamentsMap: { [key: string]: Tournament } = {};
        tournamentResults.forEach(tournament => {
          if (tournament) {
            tournamentsMap[tournament.$id] = tournament;
          }
        });
        setTournaments(tournamentsMap);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, profile]);

  const handleStatusUpdate = async (registrationId: string, newStatus: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(registrationId));

    try {
      if (newStatus === 'approved') {
        const registration = registrations.find(reg => reg.$id === registrationId);
        if (!registration) return;

        console.log('Sending approval request for:', registrationId);
        const response = await fetch('/api/admin/approve-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationId,
            status: newStatus,
            registration,
            tournamentTitle: tournaments[registration.tournamentId]?.title || tournaments[registration.tournamentId]?.gameName || 'Tournament',
            tournamentSlug: tournaments[registration.tournamentId]?.slug
          })
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to approve registration');
        }
        
        console.log('Approval successful:', data);
      } else {
        // Fallback for rejection (keep client-side or move to API too - client side is fine for simple update)
        const appwrite = initializeAppwrite();
        if (!appwrite?.databases) return;
        
        await appwrite.databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!,
          registrationId,
          { status: newStatus }
        );
      }

      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.$id === registrationId 
            ? { ...reg, status: newStatus }
            : reg
        )
      );

    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Failed to update status. Check console for details.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const parseTeamData = (jsonString?: string): TeamData => {
    if (!jsonString) return { players: [], substitutes: [] };
    try {
      const parsed = JSON.parse(jsonString);
      // Handle both old format (array) and new format (object with players/substitutes)
      if (Array.isArray(parsed)) {
        return { players: parsed, substitutes: [] };
      }
      return parsed as TeamData;
    } catch (error) {
      console.error('Error parsing team data:', error);
      return { players: [], substitutes: [] };
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile?.isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tournament Registration Management</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Back to Admin
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-[#961c18] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs">
                ({status === 'all' ? registrations.length : registrations.filter(r => r.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Registrations List */}
        {filteredRegistrations.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No registrations found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <div key={registration.$id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{registration.playerName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Tournament:</span>
                        <p className="font-medium">
                          {tournaments[registration.tournamentId]?.title || 
                           tournaments[registration.tournamentId]?.gameName || 
                           'Unknown Tournament'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="font-medium">{registration.email}</p>
                      </div>
                      {registration.university && (
                        <div>
                          <span className="text-gray-400">University:</span>
                          <p className="font-medium">{registration.university}</p>
                        </div>
                      )}
                      {registration.teamName && (
                        <div>
                          <span className="text-gray-400">Team:</span>
                          <p className="font-medium">{registration.teamName}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Registered:</span>
                        <p className="font-medium">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* Team Players and Substitutes */}
                    {registration.players && (() => {
                      const teamData = parseTeamData(registration.players);
                      return (
                        <>
                          {/* Team Players */}
                          {teamData.players.length > 0 && (
                            <div className="mt-4">
                              <span className="text-gray-400">Team Players:</span>
                              <div className="mt-2 space-y-2">
                                {teamData.players.map((player, index) => (
                                  <div key={index} className="bg-gray-700 p-3 rounded text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <div>
                                        <span className="text-gray-400">Name:</span>
                                        <p className="font-medium">{player.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Email:</span>
                                        <p className="font-medium">{player.email}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">University:</span>
                                        <p className="font-medium">{player.university}</p>
                                      </div>
                                      {player.inGameId && (
                                        <div>
                                          <span className="text-gray-400">In-Game ID:</span>
                                          <p className="font-medium">{player.inGameId}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Substitute Players */}
                          {teamData.substitutes.length > 0 && (
                            <div className="mt-4">
                              <span className="text-gray-400">Substitute Players:</span>
                              <div className="mt-2 space-y-2">
                                {teamData.substitutes.map((substitute, index) => (
                                  <div key={index} className="bg-gray-600 p-3 rounded text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <div>
                                        <span className="text-gray-400">Name:</span>
                                        <p className="font-medium">{substitute.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Email:</span>
                                        <p className="font-medium">{substitute.email}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">University:</span>
                                        <p className="font-medium">{substitute.university}</p>
                                      </div>
                                      {substitute.inGameId && (
                                        <div>
                                          <span className="text-gray-400">In-Game ID:</span>
                                          <p className="font-medium">{substitute.inGameId}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {registration.additionalInfo && (
                      <div className="mt-3">
                        <span className="text-gray-400">Additional Info:</span>
                        <p className="text-sm mt-1 bg-gray-700 p-2 rounded">
                          {registration.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {registration.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleStatusUpdate(registration.$id, 'approved')}
                        disabled={processingIds.has(registration.$id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                      >
                        {processingIds.has(registration.$id) ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(registration.$id, 'rejected')}
                        disabled={processingIds.has(registration.$id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                      >
                        {processingIds.has(registration.$id) ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}