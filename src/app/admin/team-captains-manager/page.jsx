'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AUTHORIZED_TEAM_CAPTAINS } from '@/lib/teamCaptains';
export default function AdminTeamCaptainsManagerPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [captains, setCaptains] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCaptain, setEditingCaptain] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState(null);
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        university: '',
        gameSpecialty: '',
        whatsappNumber: '',
        email: '',
        notes: ''
    });
    // Redirect if not admin
    useEffect(() => {
        if (!loading && (!user || !profile?.isAdmin)) {
            router.push('/admin');
        }
    }, [user, profile, loading, router]);
    // Load captains from localStorage on component mount and when page becomes visible
    const loadCaptains = () => {
        console.log('🔄 Loading captains from localStorage...');
        const savedCaptains = localStorage.getItem('teamCaptains');
        console.log('📦 Raw localStorage data:', savedCaptains);
        if (savedCaptains) {
            try {
                const parsedCaptains = JSON.parse(savedCaptains);
                console.log('✅ Parsed captains:', parsedCaptains);
                setCaptains(parsedCaptains);
                setMessage({ type: 'success', text: `Refreshed! Found ${parsedCaptains.length} team captains.` });
                // Auto-hide success message after 3 seconds
                setTimeout(() => setMessage(null), 3000);
            }
            catch (error) {
                console.error('❌ Error parsing localStorage data:', error);
                setMessage({ type: 'error', text: 'Error loading captain data from storage.' });
            }
        }
        else {
            console.log('🆕 No saved captains found, initializing with defaults...');
            // Initialize with existing captains from the file
            const initialCaptains = AUTHORIZED_TEAM_CAPTAINS.map((studentId, index) => ({
                id: `captain_${index}`,
                name: `Captain ${index + 1}`, // Placeholder name since AUTHORIZED_TEAM_CAPTAINS now contains student IDs
                studentId: studentId,
                dateAdded: new Date().toISOString(),
                addedBy: 'System'
            }));
            setCaptains(initialCaptains);
            localStorage.setItem('teamCaptains', JSON.stringify(initialCaptains));
            console.log('💾 Initialized with default captains:', initialCaptains);
        }
    };
    useEffect(() => {
        loadCaptains();
    }, []);
    // Refresh captains when page becomes visible (handles navigation from User Management)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadCaptains();
            }
        };
        const handleFocus = () => {
            loadCaptains();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);
    const resetForm = () => {
        setFormData({
            name: '',
            studentId: '',
            university: '',
            gameSpecialty: '',
            whatsappNumber: '',
            email: '',
            notes: ''
        });
        setEditingCaptain(null);
        setShowAddForm(false);
    };
    const handleAddCaptain = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.studentId.trim()) {
            setMessage({ type: 'error', text: 'Captain name and student ID are required' });
            return;
        }
        // Check if captain already exists by student ID
        if (captains.some(captain => captain.studentId && captain.studentId.toLowerCase() === formData.studentId.toLowerCase())) {
            setMessage({ type: 'error', text: 'A captain with this student ID already exists' });
            return;
        }
        const newCaptain = {
            id: `captain_${Date.now()}`,
            name: formData.name.trim(),
            studentId: formData.studentId.trim(),
            university: formData.university.trim() || undefined,
            gameSpecialty: formData.gameSpecialty.trim() || undefined,
            whatsappNumber: formData.whatsappNumber.trim() || undefined,
            email: formData.email.trim() || undefined,
            notes: formData.notes.trim() || undefined,
            dateAdded: new Date().toISOString(),
            addedBy: profile?.fullname || user?.email || 'Admin'
        };
        const updatedCaptains = [...captains, newCaptain];
        setCaptains(updatedCaptains);
        localStorage.setItem('teamCaptains', JSON.stringify(updatedCaptains));
        setMessage({ type: 'success', text: 'Team captain added successfully!' });
        resetForm();
    };
    const handleEditCaptain = (captain) => {
        setEditingCaptain(captain);
        setFormData({
            name: captain.name,
            studentId: captain.studentId || '',
            university: captain.university || '',
            gameSpecialty: captain.gameSpecialty || '',
            whatsappNumber: captain.whatsappNumber || '',
            email: captain.email || '',
            notes: captain.notes || ''
        });
        setShowAddForm(true);
    };
    const handleUpdateCaptain = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.studentId.trim() || !editingCaptain) {
            setMessage({ type: 'error', text: 'Captain name and student ID are required' });
            return;
        }
        // Check if another captain has the same student ID
        if (captains.some(captain => captain.id !== editingCaptain.id &&
            captain.studentId &&
            captain.studentId.toLowerCase() === formData.studentId.toLowerCase())) {
            setMessage({ type: 'error', text: 'A captain with this student ID already exists' });
            return;
        }
        const updatedCaptains = captains.map(captain => captain.id === editingCaptain.id
            ? {
                ...captain,
                name: formData.name.trim(),
                studentId: formData.studentId.trim(),
                university: formData.university.trim() || undefined,
                gameSpecialty: formData.gameSpecialty.trim() || undefined,
                whatsappNumber: formData.whatsappNumber.trim() || undefined,
                email: formData.email.trim() || undefined,
                notes: formData.notes.trim() || undefined
            }
            : captain);
        setCaptains(updatedCaptains);
        localStorage.setItem('teamCaptains', JSON.stringify(updatedCaptains));
        setMessage({ type: 'success', text: 'Team captain updated successfully!' });
        resetForm();
    };
    const handleDeleteCaptain = (captainId) => {
        const captain = captains.find(c => c.id === captainId);
        if (!captain)
            return;
        if (!confirm(`Are you sure you want to remove "${captain.name}" as a team captain?`))
            return;
        const updatedCaptains = captains.filter(c => c.id !== captainId);
        setCaptains(updatedCaptains);
        localStorage.setItem('teamCaptains', JSON.stringify(updatedCaptains));
        setMessage({ type: 'success', text: 'Team captain removed successfully!' });
    };
    const exportCaptainsList = () => {
        const captainNames = captains.map(c => c.name);
        const exportData = {
            captainNames,
            exportDate: new Date().toISOString(),
            totalCaptains: captains.length
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team-captains-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const filteredCaptains = captains.filter(captain => captain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (captain.university && captain.university.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (captain.gameSpecialty && captain.gameSpecialty.toLowerCase().includes(searchTerm.toLowerCase())));
    if (loading) {
        return (<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>);
    }
    if (!user || !profile?.isAdmin) {
        return null; // Will redirect
    }
    return (<div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Team Captains Manager</h1>
          <div className="flex gap-4">
            <button onClick={loadCaptains} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors" title="Refresh data from User Management">
              🔄 Refresh
            </button>
            <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white rounded transition-colors">
              Add Team Captain
            </button>
            <button onClick={exportCaptainsList} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              Export List
            </button>
            <button onClick={() => router.push('/admin')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
              Back to Admin
            </button>
          </div>
        </div>

        {message && (<div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'}`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-4 text-white hover:text-gray-200">
              ×
            </button>
          </div>)}

        {/* Search */}
        <div className="mb-6">
          <input type="text" placeholder="Search team captains..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
        </div>

        {/* Add/Edit Captain Modal */}
        {showAddForm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingCaptain ? 'Edit Team Captain' : 'Add Team Captain'}
              </h2>
              <form onSubmit={editingCaptain ? handleUpdateCaptain : handleAddCaptain} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Student ID *</label>
                  <input type="text" value={formData.studentId} onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))} placeholder="Enter captain's student ID" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white" required/>
                  <p className="text-xs text-gray-400 mt-1">This is the unique identifier for team captain verification</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter captain's full name" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white" required/>
                  <p className="text-xs text-gray-400 mt-1">For display purposes and contact</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">University</label>
                  <input type="text" value={formData.university} onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))} placeholder="e.g., University of Nairobi" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Game Specialty</label>
                  <input type="text" value={formData.gameSpecialty} onChange={(e) => setFormData(prev => ({ ...prev, gameSpecialty: e.target.value }))} placeholder="e.g., VALORANT, FIFA, Mobile Legends" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="captain@university.edu" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                  <input type="text" value={formData.whatsappNumber} onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))} placeholder="e.g., +254712345678" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Any additional notes..." rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"/>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white rounded transition-colors">
                    {editingCaptain ? 'Update Captain' : 'Add Captain'}
                  </button>
                  <button type="button" onClick={resetForm} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>)}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-[#961c18] mb-2">{captains.length}</div>
            <div className="text-gray-400">Total Team Captains</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">{filteredCaptains.length}</div>
            <div className="text-gray-400">Filtered Results</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {captains.filter(c => c.university).length}
            </div>
            <div className="text-gray-400">With University Info</div>
          </div>
        </div>

        {/* Captains List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Team Captains</h2>
          
          {filteredCaptains.length === 0 ? (<div className="text-center py-8 text-gray-400">
              {captains.length === 0 ? 'No team captains added yet.' : 'No team captains found matching your search.'}
            </div>) : (<div className="space-y-4">
              {filteredCaptains.map((captain) => (<div key={captain.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white mb-2">{captain.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {captain.studentId && (<div>
                            <span className="text-gray-400">Student ID:</span>
                            <p className="font-medium text-[#961c18]">{captain.studentId}</p>
                          </div>)}
                        {captain.university && (<div>
                            <span className="text-gray-400">University:</span>
                            <p className="font-medium">{captain.university}</p>
                          </div>)}
                        {captain.gameSpecialty && (<div>
                            <span className="text-gray-400">Game Specialty:</span>
                            <p className="font-medium">{captain.gameSpecialty}</p>
                          </div>)}
                        {captain.email && (<div>
                            <span className="text-gray-400">Email:</span>
                            <p className="font-medium">{captain.email}</p>
                          </div>)}
                        {captain.whatsappNumber && (<div>
                            <span className="text-gray-400">WhatsApp:</span>
                            <p className="font-medium">{captain.whatsappNumber}</p>
                          </div>)}
                        <div>
                          <span className="text-gray-400">Added:</span>
                          <p className="font-medium">{new Date(captain.dateAdded).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Added by:</span>
                          <p className="font-medium">{captain.addedBy}</p>
                        </div>
                      </div>
                      {captain.notes && (<div className="mt-3">
                          <span className="text-gray-400">Notes:</span>
                          <p className="text-sm mt-1 bg-gray-600 p-2 rounded">{captain.notes}</p>
                        </div>)}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleEditCaptain(captain)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCaptain(captain.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </div>);
}
