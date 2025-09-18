'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Client, Databases, Query, ID } from 'appwrite';

// Appwrite client setup
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

interface TeamCaptain {
  $id: string;
  $createdAt: string;
  userId: string;
  email: string;
  fullname: string;
  studentId: string;
  university?: string;
  gameSpecialty?: string;
  whatsappNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  addedBy: string;
  notes?: string;
}

interface UserProfile {
  $id: string;
  fullname: string;
  email: string;
  student_id: string;
  university?: string;
}

export default function AdminTeamCaptainsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [captains, setCaptains] = useState<TeamCaptain[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('active');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    gameSpecialty: '',
    whatsappNumber: '',
    notes: ''
  });

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/admin');
    }
  }, [user, profile, loading, router]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !profile?.isAdmin) return;

      try {
        // Fetch team captains
        const captainsResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_TEAM_CAPTAINS_COLLECTION_ID!,
          [Query.orderDesc('$createdAt'), Query.limit(100)]
        );

        setCaptains(captainsResponse.documents as unknown as TeamCaptain[]);

        // Fetch all users for the dropdown
        const usersResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
          [Query.orderAsc('fullname'), Query.limit(200)]
        );

        setUsers(usersResponse.documents as unknown as UserProfile[]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, profile]);

  const handleAddCaptain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !user) return;

    const selectedUser = users.find(u => u.$id === formData.userId);
    if (!selectedUser) return;

    setProcessingIds(prev => new Set(prev).add('add-form'));

    try {
      const newCaptain = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TEAM_CAPTAINS_COLLECTION_ID!,
        ID.unique(),
        {
          userId: selectedUser.$id,
          email: selectedUser.email,
          fullname: selectedUser.fullname,
          studentId: selectedUser.student_id,
          university: selectedUser.university || '',
          gameSpecialty: formData.gameSpecialty || '',
          whatsappNumber: formData.whatsappNumber || '',
          status: 'active',
          addedBy: user.$id,
          notes: formData.notes || ''
        }
      );

      setCaptains(prev => [newCaptain as unknown as TeamCaptain, ...prev]);
      setShowAddForm(false);
      setFormData({ userId: '', gameSpecialty: '', whatsappNumber: '', notes: '' });

    } catch (error: unknown) {
      console.error('Error adding captain:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
        alert('This user is already a team captain');
      } else {
        alert('Failed to add team captain. Please try again.');
      }
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete('add-form');
        return newSet;
      });
    }
  };

  const handleStatusUpdate = async (captainId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setProcessingIds(prev => new Set(prev).add(captainId));

    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TEAM_CAPTAINS_COLLECTION_ID!,
        captainId,
        { status: newStatus }
      );

      setCaptains(prev => 
        prev.map(captain => 
          captain.$id === captainId 
            ? { ...captain, status: newStatus }
            : captain
        )
      );

    } catch (error) {
      console.error('Error updating captain status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(captainId);
        return newSet;
      });
    }
  };

  const handleRemoveCaptain = async (captainId: string) => {
    if (!confirm('Are you sure you want to remove this team captain?')) return;

    setProcessingIds(prev => new Set(prev).add(captainId));

    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TEAM_CAPTAINS_COLLECTION_ID!,
        captainId
      );

      setCaptains(prev => prev.filter(captain => captain.$id !== captainId));

    } catch (error) {
      console.error('Error removing captain:', error);
      alert('Failed to remove team captain. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(captainId);
        return newSet;
      });
    }
  };

  const filteredCaptains = captains.filter(captain => {
    const matchesSearch = 
      captain.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      captain.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (captain.university && captain.university.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (captain.gameSpecialty && captain.gameSpecialty.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === 'all' || captain.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'inactive': return 'text-gray-400 bg-gray-400/10';
      case 'suspended': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Get available users (not already captains)
  const availableUsers = users.filter(user => 
    !captains.some(captain => captain.userId === user.$id)
  );

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading team captains...</p>
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
          <h1 className="text-3xl font-bold">Team Captains Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white rounded transition-colors"
            >
              Add Team Captain
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Back to Admin
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search captains by name, email, university, or game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
            />
          </div>
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {(['all', 'active', 'inactive', 'suspended'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-[#961c18] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                <span className="ml-2 text-xs">
                  ({filterOption === 'all' ? captains.length : captains.filter(c => c.status === filterOption).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Captain Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Team Captain</h2>
              <form onSubmit={handleAddCaptain} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select User *</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
                    required
                  >
                    <option value="">Choose a user...</option>
                    {availableUsers.map((user) => (
                      <option key={user.$id} value={user.$id}>
                        {user.fullname} ({user.email})
                        {user.university && ` - ${user.university}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Game Specialty</label>
                  <input
                    type="text"
                    value={formData.gameSpecialty}
                    onChange={(e) => setFormData(prev => ({ ...prev, gameSpecialty: e.target.value }))}
                    placeholder="e.g., VALORANT, FIFA, Mobile Legends"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    placeholder="e.g., +254712345678"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={processingIds.has('add-form')}
                    className="flex-1 py-2 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 text-white rounded transition-colors"
                  >
                    {processingIds.has('add-form') ? 'Adding...' : 'Add Captain'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Captains List */}
        {filteredCaptains.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No team captains found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCaptains.map((captain) => (
              <div key={captain.$id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{captain.fullname}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(captain.status)}`}>
                        {captain.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Student ID:</span>
                        <p className="font-medium text-[#961c18]">{captain.studentId}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="font-medium">{captain.email}</p>
                      </div>
                      {captain.university && (
                        <div>
                          <span className="text-gray-400">University:</span>
                          <p className="font-medium">{captain.university}</p>
                        </div>
                      )}
                      {captain.gameSpecialty && (
                        <div>
                          <span className="text-gray-400">Game Specialty:</span>
                          <p className="font-medium">{captain.gameSpecialty}</p>
                        </div>
                      )}
                      {captain.whatsappNumber && (
                        <div>
                          <span className="text-gray-400">WhatsApp:</span>
                          <p className="font-medium">{captain.whatsappNumber}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Added:</span>
                        <p className="font-medium">{new Date(captain.$createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {captain.notes && (
                      <div className="mt-3">
                        <span className="text-gray-400">Notes:</span>
                        <p className="text-sm mt-1 bg-gray-700 p-2 rounded">{captain.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {captain.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(captain.$id, 'inactive')}
                          disabled={processingIds.has(captain.$id)}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(captain.$id, 'suspended')}
                          disabled={processingIds.has(captain.$id)}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                        >
                          Suspend
                        </button>
                      </>
                    )}
                    {captain.status === 'inactive' && (
                      <button
                        onClick={() => handleStatusUpdate(captain.$id, 'active')}
                        disabled={processingIds.has(captain.$id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    {captain.status === 'suspended' && (
                      <button
                        onClick={() => handleStatusUpdate(captain.$id, 'active')}
                        disabled={processingIds.has(captain.$id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                      >
                        Reactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveCaptain(captain.$id)}
                      disabled={processingIds.has(captain.$id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{captains.length}</div>
            <div className="text-sm text-gray-400">Total Captains</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{captains.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-400">{captains.filter(c => c.status === 'inactive').length}</div>
            <div className="text-sm text-gray-400">Inactive</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{captains.filter(c => c.status === 'suspended').length}</div>
            <div className="text-sm text-gray-400">Suspended</div>
          </div>
        </div>
      </div>
    </div>
  );
}