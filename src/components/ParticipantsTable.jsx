"use client";
import React, { useState } from 'react';
// Helper function to normalize team data for the new design
const normalizeTeam = (team) => {
    // Parse members if it's a string, otherwise use as array
    let parsedMembers = [];
    try {
        if (typeof team.members === 'string') {
            const parsed = JSON.parse(team.members);
            // Handle the new format with players and substitutes
            if (parsed && typeof parsed === 'object' && parsed.players && Array.isArray(parsed.players)) {
                // Convert registration format to TeamMember format
                parsedMembers = [
                    // Add captain as first member
                    {
                        name: team.teamLeader,
                        ign: team.teamLeader, // Use name as IGN for captain
                        email: team.teamLeaderEmail,
                        phone: team.teamLeaderPhone || '',
                        role: 'captain'
                    },
                    // Add team players
                    ...parsed.players.map((player) => ({
                        name: player.name,
                        ign: player.inGameId || player.name, // Use inGameId as IGN, fallback to name
                        email: player.email || '',
                        phone: '',
                        role: 'player'
                    })),
                    // Add substitutes if any
                    ...(parsed.substitutes || []).map((sub) => ({
                        name: sub.name,
                        ign: sub.inGameId || sub.name,
                        email: sub.email || '',
                        phone: '',
                        role: 'substitute'
                    }))
                ];
            }
            else if (Array.isArray(parsed)) {
                // Handle old format (direct array)
                parsedMembers = parsed;
            }
            else {
                // Fallback: create captain entry
                parsedMembers = [{
                        name: team.teamLeader,
                        ign: team.teamLeader,
                        email: team.teamLeaderEmail,
                        phone: team.teamLeaderPhone || '',
                        role: 'captain'
                    }];
            }
        }
        else if (Array.isArray(team.members)) {
            parsedMembers = team.members;
        }
        else if (team.members && typeof team.members === 'object') {
            // Handle case where members is already parsed object
            if (team.members.players && Array.isArray(team.members.players)) {
                const membersObj = team.members;
                parsedMembers = [
                    // Add captain as first member
                    {
                        name: team.teamLeader,
                        ign: team.teamLeader,
                        email: team.teamLeaderEmail,
                        phone: team.teamLeaderPhone || '',
                        role: 'captain'
                    },
                    // Add team players
                    ...membersObj.players.map((player) => ({
                        name: player.name,
                        ign: player.inGameId || player.name,
                        email: player.email || '',
                        phone: '',
                        role: 'player'
                    })),
                    // Add substitutes if any
                    ...(membersObj.substitutes || []).map((sub) => ({
                        name: sub.name,
                        ign: sub.inGameId || sub.name,
                        email: sub.email || '',
                        phone: '',
                        role: 'substitute'
                    }))
                ];
            }
        }
        else {
            // Fallback: create captain entry
            parsedMembers = [{
                    name: team.teamLeader,
                    ign: team.teamLeader,
                    email: team.teamLeaderEmail,
                    phone: team.teamLeaderPhone || '',
                    role: 'captain'
                }];
        }
    }
    catch (error) {
        console.error(`Error parsing team members for ${team.teamName}:`, error);
        parsedMembers = [{
                name: team.teamLeader,
                ign: team.teamLeader,
                email: team.teamLeaderEmail,
                phone: team.teamLeaderPhone || '',
                role: 'captain'
            }];
    }
    return {
        id: team.$id || '',
        teamName: team.teamName,
        universityName: team.university || 'Unknown University',
        universityLogo: '', // We don't have logos in our current data structure
        captain: team.teamLeader,
        members: parsedMembers.map(m => m.name || m.ign || 'Unknown'),
        memberDetails: parsedMembers,
        status: team.status === 'approved' ? 'confirmed' : team.status === 'rejected' ? 'incomplete' : 'pending',
        registrationDate: team.registrationDate,
        contactInfo: {
            email: team.teamLeaderEmail,
            phone: team.teamLeaderPhone
        },
        totalMembers: team.totalMembers,
        paymentStatus: team.paymentStatus
    };
};
export const ParticipantsTable = ({ teams, gameSlug, showAdminActions = false, onStatusUpdate, onPaymentUpdate, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [universityFilter, setUniversityFilter] = useState('all');
    // Normalize all teams to a consistent format
    const normalizedTeams = teams.map(normalizeTeam);
    const filteredTeams = normalizedTeams.filter(team => {
        const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.captain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
        const matchesUniversity = universityFilter === 'all' || team.universityName === universityFilter;
        return matchesSearch && matchesStatus && matchesUniversity;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-600';
            case 'pending': return 'bg-yellow-600';
            case 'incomplete': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return '✅';
            case 'pending': return '⏳';
            case 'incomplete': return '❌';
            default: return '❓';
        }
    };
    const universities = Array.from(new Set(normalizedTeams.map(team => team.universityName))).sort();
    return (<div className="relative bg-black/60 border border-[#8c110d] p-8 md:p-12" style={{
            backgroundImage: 'url(/images/Mask Group.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
        }}>
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-center text-white">
            Tournament Participants
          </h2>
          <p className="text-lg text-center text-white mb-4">
            Teams registered for the tournament
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/80 p-4 text-center border border-[#8c110d]">
            <div className="text-2xl font-bold text-[#8c110d] mb-1">{normalizedTeams.length}</div>
            <div className="text-white text-sm">Total Teams</div>
          </div>
          <div className="bg-black/80 p-4 text-center border border-[#8c110d]">
            <div className="text-2xl font-bold text-[#8c110d] mb-1">
              {normalizedTeams.filter(team => team.status === 'confirmed').length}
            </div>
            <div className="text-white text-sm">Confirmed</div>
          </div>
          <div className="bg-black/80 p-4 text-center border border-[#8c110d]">
            <div className="text-2xl font-bold text-[#8c110d] mb-1">
              {normalizedTeams.reduce((sum, team) => sum + team.members.length, 0)}
            </div>
            <div className="text-white text-sm">Total Players</div>
          </div>
          <div className="bg-black/80 p-4 text-center border border-[#8c110d]">
            <div className="text-2xl font-bold text-[#8c110d] mb-1">{universities.length}</div>
            <div className="text-white text-sm">Universities</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <input type="text" placeholder="Search teams, universities, or captains..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/80 border border-[#8c110d] text-white px-4 py-3 focus:outline-none focus:border-[#8c110d] focus:ring-1 focus:ring-[#8c110d]"/>
          </div>
          
          <div>
            <select value={universityFilter} onChange={(e) => setUniversityFilter(e.target.value)} className="w-full bg-black/80 border border-[#8c110d] text-white px-4 py-3 focus:outline-none focus:border-[#8c110d] focus:ring-1 focus:ring-[#8c110d]">
              <option value="all">All Universities</option>
              {universities.map((university) => (<option key={university} value={university}>
                  {university}
                </option>))}
            </select>
          </div>
          
          <div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-black/80 border border-[#8c110d] text-white px-4 py-3 focus:outline-none focus:border-[#8c110d] focus:ring-1 focus:ring-[#8c110d]">
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-black/90 border border-[#8c110d] overflow-hidden">
          {teams.length === 0 ? (<div className="p-8 text-center">
              <p className="text-white text-lg">No teams have been registered for this tournament yet.</p>
              <p className="text-gray-400 text-sm mt-2">Teams will appear here once they are approved and added through the admin panel.</p>
            </div>) : filteredTeams.length === 0 ? (<div className="p-8 text-center">
              <p className="text-white text-lg">No teams found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
            </div>) : (<div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#8c110d]">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-bold">Team</th>
                    <th className="px-6 py-4 text-left text-white font-bold">University</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Captain</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Members</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Status</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Registered</th>
                    {showAdminActions && (<th className="px-6 py-4 text-center text-white font-bold">Actions</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team, index) => (<tr key={team.id} className={`border-b border-[#8c110d] hover:bg-[#8c110d]/20 transition-colors ${index % 2 === 0 ? 'bg-black/30' : 'bg-black/50'}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-lg">{team.teamName}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-white">{team.universityName}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-white">{team.captain}</div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="text-white font-semibold">{team.members.length}</div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white ${getStatusColor(team.status)}`}>
                          <span>{getStatusIcon(team.status)}</span>
                          {team.status.toUpperCase()}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="text-white text-sm">
                          {new Date(team.registrationDate).toLocaleDateString()}
                        </div>
                      </td>

                      {showAdminActions && (<td className="px-6 py-4 text-center">
                          <div className="flex gap-1 justify-center">
                            {onStatusUpdate && (<>
                                <button onClick={() => onStatusUpdate(team.id, 'approved')} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded" disabled={team.status === 'confirmed'}>
                                  Approve
                                </button>
                                <button onClick={() => onStatusUpdate(team.id, 'rejected')} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded" disabled={team.status === 'incomplete'}>
                                  Reject
                                </button>
                              </>)}
                            {onDelete && (<button onClick={() => {
                            if (confirm('Are you sure you want to delete this team?')) {
                                onDelete(team.id);
                            }
                        }} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">
                                Delete
                              </button>)}
                          </div>
                        </td>)}
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>

        {/* Team Details Expandable Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Team Details</h3>
          {filteredTeams.map((team) => (<details key={`details-${team.id}`} className="bg-black/80 border border-[#8c110d]">
              <summary className="px-6 py-4 cursor-pointer hover:bg-[#8c110d]/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="text-white font-bold text-lg">{team.teamName}</h4>
                      <p className="text-white/60 text-sm">{team.universityName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-semibold text-white ${getStatusColor(team.status)}`}>
                      {team.status.toUpperCase()}
                    </span>
                    {showAdminActions && team.paymentStatus && (<span className={`px-3 py-1 text-xs font-semibold text-white ${team.paymentStatus === 'paid' ? 'bg-blue-600' :
                    team.paymentStatus === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                        {team.paymentStatus.toUpperCase()}
                      </span>)}
                  </div>
                </div>
              </summary>
              
              <div className="px-6 pb-6 border-t border-[#8c110d]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h5 className="text-white font-semibold mb-2">Team Information</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">Captain:</span>
                        <span className="text-white ml-2">{team.captain}</span>
                      </div>
                      {showAdminActions && (<>
                          <div>
                            <span className="text-white/60">Email:</span>
                            <span className="text-white ml-2">{team.contactInfo.email}</span>
                          </div>
                          {team.contactInfo.phone && (<div>
                              <span className="text-white/60">Phone:</span>
                              <span className="text-white ml-2">{team.contactInfo.phone}</span>
                            </div>)}
                        </>)}
                      <div>
                        <span className="text-white/60">Registration Date:</span>
                        <span className="text-white ml-2">{new Date(team.registrationDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-white/60">University:</span>
                        <span className="text-white ml-2">{team.universityName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-white font-semibold mb-2">
                      Team Members ({team.members.length})
                    </h5>
                    <div className="space-y-2">
                      {team.memberDetails.map((member, index) => (<div key={index} className="bg-[#8c110d]/20 p-3 rounded">
                          <div className="text-white font-medium">{member.name}</div>
                          <div className="text-[#8c110d] text-sm font-mono">IGN: {member.ign}</div>
                          {member.role && (<div className="text-white/60 text-sm">Role: {member.role}</div>)}
                        </div>))}
                    </div>

                    {showAdminActions && (<div className="mt-4 pt-4 border-t border-[#8c110d]/30 flex gap-2">
                        {onPaymentUpdate && (<div className="flex gap-1">
                            <button onClick={() => onPaymentUpdate(team.id, 'paid')} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded" disabled={team.paymentStatus === 'paid'}>
                              Mark Paid
                            </button>
                            <button onClick={() => onPaymentUpdate(team.id, 'failed')} className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded" disabled={team.paymentStatus === 'failed'}>
                              Mark Failed
                            </button>
                          </div>)}
                      </div>)}
                  </div>
                </div>
              </div>
            </details>))}
        </div>
      </div>
    </div>);
};
