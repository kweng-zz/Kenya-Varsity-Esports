'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ParticipantsTable } from '@/components/ParticipantsTable';
import Link from 'next/link';
import { Client, Databases, Query } from 'appwrite';

// Types
interface Tournament {
  $id: string;
  gameName: string;
  title?: string;
  slug?: string;
  status?: string;
}

interface Registration {
  $id: string;
  tournamentId: string;
  teamName?: string;
  playerName: string;
  email: string;
  university?: string;
  players?: string;
  status: string;
  registrationDate?: string;
  $createdAt?: string;
}

interface ParticipantsData {
  teams: any[];
  totalTeams: number;
  totalParticipants: number;
  approvedTeams: number;
  pendingTeams: number;
}

// Appwrite client singleton
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing');
      return null;
    }

    try {
      client = new Client().setEndpoint(endpoint).setProject(projectId);
      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite:', error);
      return null;
    }
  }
  return databases;
};

export default function ParticipantsAdminPage() {
  const { user, profile } = useAuth();
  const [participantsData, setParticipantsData] = useState<ParticipantsData>({
    teams: [],
    totalTeams: 0,
    totalParticipants: 0,
    approvedTeams: 0,
    pendingTeams: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);

  // Fetch tournaments from Appwrite
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const db = initializeAppwrite();
        if (!db) {
          console.warn('Appwrite not initialized');
          setTournamentsLoading(false);
          return;
        }

        const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
        const TOURNAMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID!;

        console.log('🔍 [Admin Participants] Fetching tournaments from Appwrite...');
        const response = await db.listDocuments(
          DB_ID,
          TOURNAMENTS_COLLECTION_ID,
          [Query.orderDesc('$createdAt'), Query.limit(50)]
        );

        console.log(`✅ [Admin Participants] Found ${response.documents.length} tournaments`);
        setTournaments(response.documents as unknown as Tournament[]);
      } catch (err) {
        console.error('❌ [Admin Participants] Error fetching tournaments:', err);
      } finally {
        setTournamentsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Fetch registrations when tournament is selected
  const fetchParticipants = async (tournamentId: string) => {
    if (!tournamentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const db = initializeAppwrite();
      if (!db) {
        setError('Appwrite not initialized');
        return;
      }

      const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
      const REGISTRATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!;

      console.log(`🔍 [Admin Participants] Fetching registrations for tournament ID: ${tournamentId}`);
      
      const response = await db.listDocuments(
        DB_ID,
        REGISTRATIONS_COLLECTION_ID,
        [
          Query.equal('tournamentId', tournamentId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      console.log(`✅ [Admin Participants] Found ${response.documents.length} registrations`);

      // Transform registrations to participant format for ParticipantsTable
      const teams = response.documents.map((doc: any) => ({
        $id: doc.$id,
        id: doc.$id,
        tournamentId: doc.tournamentId,
        teamName: doc.teamName || doc.playerName,
        playerName: doc.playerName,
        teamLeader: doc.playerName,
        email: doc.email,
        teamLeaderEmail: doc.email,
        university: doc.university,
        members: doc.players || '{"players":[],"substitutes":[]}',
        registrationDate: doc.registrationDate || doc.$createdAt,
        status: doc.status,
        paymentStatus: doc.paymentStatus || 'pending',
        totalMembers: 1
      }));

      const approvedTeams = teams.filter((t: any) => t.status === 'approved').length;
      const pendingTeams = teams.filter((t: any) => t.status === 'pending' || t.status === 'registered').length;

      setParticipantsData({
        teams,
        totalTeams: teams.length,
        totalParticipants: teams.length,
        approvedTeams,
        pendingTeams
      });
    } catch (err: any) {
      console.error('❌ [Admin Participants] Error fetching registrations:', err);
      setError(err.message || 'Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  // Handle tournament selection
  useEffect(() => {
    if (selectedTournamentId) {
      fetchParticipants(selectedTournamentId);
    }
  }, [selectedTournamentId]);

  // Handle status update
  const handleStatusUpdate = async (participantId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const db = initializeAppwrite();
      if (!db) return;

      await db.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!,
        participantId,
        { status }
      );
      await fetchParticipants(selectedTournamentId);
    } catch (err: any) {
      setError(err.message || 'Failed to update participant status');
    }
  };

  // Handle payment update
  const handlePaymentUpdate = async (participantId: string, paymentStatus: 'pending' | 'paid' | 'failed') => {
    try {
      const db = initializeAppwrite();
      if (!db) return;

      await db.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!,
        participantId,
        { paymentStatus }
      );
      await fetchParticipants(selectedTournamentId);
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    }
  };

  // Handle delete
  const handleDelete = async (participantId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    
    try {
      const db = initializeAppwrite();
      if (!db) return;

      await db.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!,
        participantId
      );
      await fetchParticipants(selectedTournamentId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete participant');
    }
  };

  // Check if user is admin - AFTER all hooks
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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Participants Management</h1>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Admin
            </Link>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#8c110d] hover:bg-[#7a0f0b] px-6 py-2 rounded-lg font-semibold"
            >
              Add Participant
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tournament Selection */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Select Tournament</h2>
          <div className="flex gap-4 items-center">
            {tournamentsLoading ? (
              <p className="text-gray-400">Loading tournaments...</p>
            ) : (
              <select
                value={selectedTournamentId}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white min-w-[300px]"
              >
                <option value="">Select a tournament...</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.$id} value={tournament.$id}>
                    {tournament.title || tournament.gameName} {tournament.status === 'published' ? '(Live)' : '(Draft)'}
                  </option>
                ))}
              </select>
            )}
            
            {selectedTournamentId && (
              <button
                onClick={() => fetchParticipants(selectedTournamentId)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        {selectedTournamentId && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Teams</h3>
              <p className="text-3xl font-bold text-white">{participantsData.totalTeams}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Participants</h3>
              <p className="text-3xl font-bold text-white">{participantsData.totalParticipants}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Approved Teams</h3>
              <p className="text-3xl font-bold text-green-400">{participantsData.approvedTeams}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Pending Teams</h3>
              <p className="text-3xl font-bold text-yellow-400">{participantsData.pendingTeams}</p>
            </div>
          </div>
        )}

        {/* Participants Table */}
        {selectedTournamentId && (
          <div className="bg-gray-900 rounded-lg p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c110d] mx-auto mb-4"></div>
                <p>Loading participants...</p>
              </div>
            ) : (
              <ParticipantsTable
                teams={participantsData.teams}
                gameSlug={selectedTournamentId}
                showAdminActions={true}
                onStatusUpdate={handleStatusUpdate}
                onPaymentUpdate={handlePaymentUpdate}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}

        {!selectedTournamentId && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Select a tournament to view participants</p>
          </div>
        )}

        {/* Add Participant Modal */}
        {showAddForm && selectedTournamentId && (
          <AddParticipantModal
            tournamentId={selectedTournamentId}
            tournamentSlug={selectedTournamentId}
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              fetchParticipants(selectedTournamentId);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Add Participant Modal Component
interface AddParticipantModalProps {
  tournamentId: string;
  tournamentSlug: string;
  onClose: () => void;
  onSuccess: () => void;
}

function AddParticipantModal({ tournamentId, tournamentSlug, onClose, onSuccess }: AddParticipantModalProps) {
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeader: '',
    teamLeaderEmail: '',
    teamLeaderPhone: '',
    university: '',
    members: [{ name: '', ign: '', email: '', phone: '', role: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { name: '', ign: '', email: '', phone: '', role: '' }]
    }));
  };

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const updateMember = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const db = initializeAppwrite();
      if (!db) {
        setError('Appwrite not initialized');
        setLoading(false);
        return;
      }

      const participantData = {
        tournamentId,
        teamName: formData.teamName,
        playerName: formData.teamLeader,
        email: formData.teamLeaderEmail,
        university: formData.university,
        players: JSON.stringify({
          players: formData.members.filter(member => member.name && member.ign),
          substitutes: []
        }),
        registrationDate: new Date().toISOString(),
        status: 'approved',
        paymentStatus: 'paid',
      };

      await db.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!,
        'unique()',
        participantData
      );
      
      onSuccess();
    } catch (err: any) {
      console.error('Error creating participant:', err);
      setError(err.message || 'Failed to create participant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Participant</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Team Name *</label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Team Leader *</label>
              <input
                type="text"
                value={formData.teamLeader}
                onChange={(e) => setFormData(prev => ({ ...prev, teamLeader: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Leader Email *</label>
              <input
                type="email"
                value={formData.teamLeaderEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, teamLeaderEmail: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Leader Phone</label>
              <input
                type="tel"
                value={formData.teamLeaderPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, teamLeaderPhone: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">University</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <button
                type="button"
                onClick={addMember}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                Add Member
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.members.map((member, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Member {index + 1}</h4>
                    {formData.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">IGN *</label>
                      <input
                        type="text"
                        value={member.ign}
                        onChange={(e) => updateMember(index, 'ign', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => updateMember(index, 'phone', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                        placeholder="e.g., Captain, Support"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8c110d] hover:bg-[#7a0f0b] px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Participant'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}