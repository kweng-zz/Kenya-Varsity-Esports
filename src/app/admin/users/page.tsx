'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Client, Databases, Query } from 'appwrite';
import { mailchimpClientService, MailchimpContact } from '@/lib/mailchimp-client';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for admin users');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for admin users');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for admin users:', error);
      return null;
    }
  }
  return databases;
};

interface UserProfile {
  $id: string;
  $createdAt: string;
  fullname: string;
  email: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
  isAdmin?: boolean;
  isTeamCaptain?: boolean;
  user_type?: 'participant' | 'visitor';
  status?: 'pending' | 'approved' | 'rejected';
}

export default function AdminUsersPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'admins' | 'captains' | 'regular' | 'pending'>('all');
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  // Mailchimp states
  const [mailchimpStats, setMailchimpStats] = useState<any>(null);
  const [syncingToMailchimp, setSyncingToMailchimp] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [connectionTest, setConnectionTest] = useState<{ success?: boolean; message?: string }>({});

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/admin');
    }
  }, [user, profile, loading, router]);

  // Fetch users with proper error handling
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || !profile?.isAdmin) return;

      try {
        const db = initializeAppwrite();
        if (!db) {
          console.warn('Appwrite not configured, skipping users fetch');
          setLoadingUsers(false);
          return;
        }

        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
          [Query.orderDesc('$createdAt'), Query.limit(100)]
        );

        // Map users and ensure isTeamCaptain defaults to false if undefined
        const usersData = response.documents.map((doc: any) => ({
          ...doc,
          isTeamCaptain: doc.isTeamCaptain || false
        })) as UserProfile[];

        setUsers(usersData);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user, profile]);

  // Mailchimp functions
  const testMailchimpConnection = async () => {
    const result = await mailchimpClientService.testConnection();
    setConnectionTest({
      success: result.success,
      message: result.success ? '✅ Connected to Mailchimp successfully!' : `❌ ${result.error}`
    });
  };

  const fetchMailchimpStats = async () => {
    const result = await mailchimpClientService.getAudienceStats();
    if (result.success) {
      setMailchimpStats(result.stats);
    } else {
      console.error('Failed to fetch Mailchimp stats:', result.error);
    }
  };

  const syncAllUsersToMailchimp = async () => {
    if (!users.length) return;

    setSyncingToMailchimp(true);
    setSyncProgress(0);
    setError(null);

    try {
      const contacts: MailchimpContact[] = users.map(user => ({
        email: user.email,
        fullname: user.fullname,
        university: user.university,
        student_id: user.student_id,
        phone_number: user.phone_number,
      }));

      setSyncProgress(30);
      const result = await mailchimpClientService.addContactsBatch(contacts);
      setSyncProgress(100);

      if (result.success && result.data) {
        setError(`✅ Successfully synced ${result.data.total} users to Mailchimp! 
          Added: ${result.data.added}, Updated: ${result.data.updated}, Errors: ${result.data.errors}`);
        
        if (result.data.errorMessages && result.data.errorMessages.length > 0) {
          console.log('Mailchimp errors:', result.data.errorMessages);
        }
        
        await fetchMailchimpStats();
      } else {
        setError(`❌ Failed to sync users: ${result.error}`);
      }
    } catch (error: any) {
      setError(`❌ Sync failed: ${error.message}`);
    } finally {
      setSyncingToMailchimp(false);
      setTimeout(() => setSyncProgress(0), 2000);
    }
  };

  const syncUserToMailchimp = async (userProfile: UserProfile) => {
    setUpdatingUsers(prev => new Set(prev).add(userProfile.$id));
    setError(null);

    try {
      const contact: MailchimpContact = {
        email: userProfile.email,
        fullname: userProfile.fullname,
        university: userProfile.university,
        student_id: userProfile.student_id,
        phone_number: userProfile.phone_number,
      };

      const result = await mailchimpClientService.addContact(contact);

      if (result.success) {
        setError(`✅ ${userProfile.fullname} synced to Mailchimp successfully!`);
      } else {
        setError(`❌ Failed to sync ${userProfile.fullname}: ${result.error}`);
      }
    } catch (error: any) {
      setError(`❌ Sync failed: ${error.message}`);
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userProfile.$id);
        return newSet;
      });
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchMailchimpStats();
      testMailchimpConnection();
    }
  }, [user, profile]);

  // Sync with Team Captains Manager localStorage
  const syncWithTeamCaptainsManager = (userProfile: UserProfile, isTeamCaptain: boolean) => {
    console.log('🔄 Starting sync with Team Captains Manager...');
    console.log('👤 User Profile:', userProfile);
    console.log('🎯 Is Team Captain:', isTeamCaptain);
    
    try {
      const savedCaptains = localStorage.getItem('teamCaptains');
      console.log('📦 Current localStorage data:', savedCaptains);
      
      let captains = savedCaptains ? JSON.parse(savedCaptains) : [];
      console.log('📋 Parsed captains array:', captains);

      if (isTeamCaptain) {
        console.log('➕ Adding user as team captain...');
        
        // Add to team captains if not already there
        const existingCaptain = captains.find((captain: any) => 
          captain.studentId === userProfile.student_id || 
          captain.email === userProfile.email
        );
        
        console.log('🔍 Existing captain found:', existingCaptain);

        if (!existingCaptain) {
          const newCaptain = {
            id: `captain_${Date.now()}`,
            name: userProfile.fullname,
            studentId: userProfile.student_id || '',
            university: userProfile.university || '',
            email: userProfile.email,
            dateAdded: new Date().toISOString(),
            addedBy: profile?.fullname || user?.email || 'Admin',
            notes: 'Added via User Management'
          };

          console.log('🆕 New captain object:', newCaptain);
          captains.push(newCaptain);
          console.log('📝 Updated captains array:', captains);
          
          localStorage.setItem('teamCaptains', JSON.stringify(captains));
          console.log('💾 Saved to localStorage successfully!');
        } else {
          console.log('⚠️ Captain already exists, skipping...');
        }
      } else {
        console.log('➖ Removing user from team captains...');
        
        const originalLength = captains.length;
        captains = captains.filter((captain: any) => 
          captain.studentId !== userProfile.student_id && 
          captain.email !== userProfile.email
        );
        
        console.log(`🗑️ Removed ${originalLength - captains.length} captains`);
        console.log('📝 Updated captains array:', captains);
        
        localStorage.setItem('teamCaptains', JSON.stringify(captains));
        console.log('💾 Saved to localStorage successfully!');
      }
    } catch (error) {
      console.error('❌ Error syncing with Team Captains Manager:', error);
    }
  };

  const approveUser = async (userId: string, userName: string) => {
    setUpdatingUsers(prev => new Set(prev).add(userId));
    setError(null);

    try {
      const db = initializeAppwrite();
      if (!db) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      await db.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
        userId,
        { status: 'approved' }
      );

      setUsers(prev => 
        prev.map(user => 
          user.$id === userId 
            ? { ...user, status: 'approved' }
            : user
        )
      );

      setError(`✅ ${userName} has been approved successfully!`);
    } catch (error: any) {
      console.error('Error approving user:', error);
      setError(`Failed to approve user: ${error.message}`);
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const updateUserRole = async (userId: string, field: 'isAdmin' | 'isTeamCaptain', value: boolean) => {
    setUpdatingUsers(prev => new Set(prev).add(userId));
    setError(null);

    // Get the user profile for syncing
    const userProfile = users.find(u => u.$id === userId);

    try {
      const db = initializeAppwrite();
      if (!db) {
        setError('Appwrite not configured. Please try again.');
        return;
      }

      // First, try to update the document
      await db.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
        userId,
        { [field]: value }
      );

      // Update local state only if the update was successful
      setUsers(prev => 
        prev.map(user => 
          user.$id === userId 
            ? { ...user, [field]: value }
            : user
        )
      );

      // Sync with Team Captains Manager if updating isTeamCaptain
      if (field === 'isTeamCaptain' && userProfile) {
        syncWithTeamCaptainsManager(userProfile, value);
        
        if (value) {
          setError(null);
          // Show success message for team captain addition
          setTimeout(() => {
            setError(`✅ ${userProfile.fullname} has been added as a team captain and synced with the Team Captains Manager.`);
          }, 100);
        } else {
          setError(null);
          setTimeout(() => {
            setError(`✅ ${userProfile.fullname} has been removed as a team captain and synced with the Team Captains Manager.`);
          }, 100);
        }
      }

    } catch (error: any) {
      console.error(`Error updating user ${field}:`, error);
      
      // Handle specific error cases
      if (error.message?.includes('Unknown attribute')) {
        setError(`The "${field}" attribute doesn't exist in your user collection. Please add it in your Appwrite console.`);
      } else {
        setError(`Failed to update user role. Please try again.`);
      }
      
      // Refresh users to ensure UI is in sync with database
      try {
        const refreshDb = initializeAppwrite();
        if (refreshDb) {
          const response = await refreshDb.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
            [Query.orderDesc('$createdAt'), Query.limit(100)]
          );
          
          const usersData = response.documents.map((doc: any) => ({
            ...doc,
            isTeamCaptain: doc.isTeamCaptain || false
          })) as UserProfile[];
          
          setUsers(usersData);
        }
      } catch (refreshError) {
        console.error('Error refreshing users:', refreshError);
      }
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.university && user.university.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      filter === 'all' ||
      (filter === 'admins' && user.isAdmin) ||
      (filter === 'captains' && user.isTeamCaptain) ||
      (filter === 'regular' && !user.isAdmin && !user.isTeamCaptain) ||
      (filter === 'pending' && user.status === 'pending');

    return matchesSearch && matchesFilter;
  });

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading users...</p>
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Back to Admin
          </button>
        </div>

        {/* Mailchimp Section Removed as per user request */}

        {/* Status Message */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 ${
            error.startsWith('✅') 
              ? 'bg-green-900/20 border border-green-600/30' 
              : 'bg-red-900/20 border border-red-600/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className={error.startsWith('✅') ? 'text-green-200' : 'text-red-200'}>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className={`text-sm hover:opacity-70 ${
                  error.startsWith('✅') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
            />
          </div>
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {(['all', 'pending', 'admins', 'captains', 'regular'] as const).map((filterOption) => (
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
                  ({filterOption === 'all' ? users.length : 
                    filterOption === 'admins' ? users.filter(u => u.isAdmin).length :
                    filterOption === 'captains' ? users.filter(u => u.isTeamCaptain).length :
                    filterOption === 'pending' ? users.filter(u => u.status === 'pending').length :
                    users.filter(u => !u.isAdmin && !u.isTeamCaptain).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold">User</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Type/Status</th>
                  <th className="px-6 py-4 text-left text-white font-bold">University</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Action</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Admin</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userProfile) => (
                  <tr key={userProfile.$id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{userProfile.fullname}</div>
                        <div className="text-sm text-gray-400">{userProfile.email}</div>
                        {userProfile.student_id && (
                          <div className="text-xs text-gray-500">ID: {userProfile.student_id}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                            userProfile.user_type === 'participant' ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {userProfile.user_type || 'visitor'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                            userProfile.status === 'approved' ? 'bg-green-900 text-green-200' :
                            userProfile.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {userProfile.status || 'approved'}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{userProfile.university || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {userProfile.status === 'pending' && (
                         <button
                           onClick={() => approveUser(userProfile.$id, userProfile.fullname)}
                           disabled={updatingUsers.has(userProfile.$id)}
                           className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-medium transition-colors disabled:opacity-50"
                         >
                           {updatingUsers.has(userProfile.$id) ? 'Approving...' : 'Approve'}
                         </button>
                       )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => updateUserRole(userProfile.$id, 'isAdmin', !userProfile.isAdmin)}
                        disabled={updatingUsers.has(userProfile.$id) || userProfile.$id === user?.$id}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          userProfile.isAdmin
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingUsers.has(userProfile.$id) ? 'Updating...' : 
                         userProfile.isAdmin ? 'Admin' : 'Make Admin'}
                      </button>
                      {userProfile.$id === user?.$id && (
                        <div className="text-xs text-gray-500 mt-1">You</div>
                      )}
                    </td>


                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-400">
                        {new Date(userProfile.$createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No users found matching your search criteria.
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{users.filter(u => u.isAdmin).length}</div>
            <div className="text-sm text-gray-400">Admins</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{users.filter(u => u.isTeamCaptain).length}</div>
            <div className="text-sm text-gray-400">Team Captains</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-400">{users.filter(u => !u.isAdmin && !u.isTeamCaptain).length}</div>
            <div className="text-sm text-gray-400">Regular Users</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">{users.filter(u => u.status === 'pending').length}</div>
            <div className="text-sm text-gray-400">Pending Approvals</div>
          </div>
        </div>
      </div>
    </div>
  );
}