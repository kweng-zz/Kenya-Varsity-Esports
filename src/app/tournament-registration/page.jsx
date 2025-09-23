'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Client, Databases, ID } from 'appwrite';
import { isAuthorizedTeamCaptain } from '@/lib/teamCaptains';
import { getGameBySlug } from '@/lib/gamesData';
// Appwrite Setup with lazy initialization
let client = null;
let databases = null;
const initializeAppwrite = () => {
    if (!client) {
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        if (!endpoint || !projectId) {
            console.warn('Appwrite configuration missing for tournament registration');
            return null;
        }
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for tournament registration');
            return null;
        }
        try {
            client = new Client()
                .setEndpoint(endpoint)
                .setProject(projectId);
            databases = new Databases(client);
        }
        catch (error) {
            console.error('Failed to initialize Appwrite client for tournament registration:', error);
            return null;
        }
    }
    return { databases };
};
export default function TournamentRegistrationPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState('');
    const [teamName, setTeamName] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [isTeamCaptain, setIsTeamCaptain] = useState(null);
    const [checkingCaptainStatus, setCheckingCaptainStatus] = useState(true);
    const [players, setPlayers] = useState([]);
    const [substitutes, setSubstitutes] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    // Check if user is a team captain based on their student ID
    useEffect(() => {
        if (profile?.student_id) {
            const isCaptain = isAuthorizedTeamCaptain(profile.student_id);
            setIsTeamCaptain(isCaptain);
            setCheckingCaptainStatus(false);
        }
        else if (!loading && profile) {
            // Profile loaded but no student_id
            setIsTeamCaptain(false);
            setCheckingCaptainStatus(false);
        }
    }, [profile, loading]);
    // Fetch available tournaments
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const appwrite = initializeAppwrite();
                if (!appwrite?.databases) {
                    console.warn('Appwrite not configured, skipping tournaments fetch');
                    setLoadingTournaments(false);
                    return;
                }
                const response = await appwrite.databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID);
                // Filter tournaments that are open for registration
                const openTournaments = response.documents.filter((tournament) => tournament.tournamentStatus === 'registration_open');
                setTournaments(openTournaments);
            }
            catch (error) {
                console.error('Error fetching tournaments:', error);
                setMessage({ type: 'error', text: 'Failed to load tournaments' });
            }
            finally {
                setLoadingTournaments(false);
            }
        };
        if (user) {
            fetchTournaments();
        }
    }, [user]);
    // Map tournament game names to game slugs
    const getGameSlugFromName = (gameName) => {
        const gameNameMappings = {
            'PUBG Mobile': 'pubg-mobile',
            'Call of Duty Mobile BR': 'call-of-duty-mobile-br',
            'COD Mobile BR': 'call-of-duty-mobile-br',
            'CODM BR': 'call-of-duty-mobile-br',
            'eFootball Mobile': 'efootball-mobile',
            'eFootball': 'efootball-mobile',
            'Free Fire': 'free-fire',
            'Fortnite': 'fortnite',
            'Bloodstrike': 'bloodstrike',
            'Chess': 'chess',
            'EA FC 2V2': 'ea-fc-2v2',
            'EA FC': 'ea-fc-2v2',
            'Call of Duty Mobile': 'call-of-duty',
            'Call of Duty': 'call-of-duty',
            'COD Mobile': 'call-of-duty',
            'CODM': 'call-of-duty'
        };
        return gameNameMappings[gameName] || null;
    };
    // Handle tournament selection and initialize team structure
    const handleTournamentSelection = (tournamentId) => {
        setSelectedTournament(tournamentId);
        if (tournamentId) {
            const tournament = tournaments.find(t => t.$id === tournamentId);
            if (tournament?.gameName) {
                const gameSlug = getGameSlugFromName(tournament.gameName);
                const game = gameSlug ? getGameBySlug(gameSlug) : null;
                setSelectedGame(game || null);
                if (game) {
                    // Initialize players array based on game rules
                    const requiredPlayers = game.rules.minTeamSize;
                    const maxSubstitutes = game.rules.maxSubstitutes || 0;
                    // Initialize main players (excluding captain who is already registered)
                    const initialPlayers = [];
                    for (let i = 1; i < requiredPlayers; i++) {
                        initialPlayers.push({
                            name: '',
                            email: '',
                            university: profile?.university || '',
                            inGameId: '',
                            additionalInfo: ''
                        });
                    }
                    // Initialize substitutes
                    const initialSubstitutes = [];
                    for (let i = 0; i < maxSubstitutes; i++) {
                        initialSubstitutes.push({
                            name: '',
                            email: '',
                            university: profile?.university || '',
                            inGameId: '',
                            additionalInfo: ''
                        });
                    }
                    setPlayers(initialPlayers);
                    setSubstitutes(initialSubstitutes);
                }
            }
            else {
                setSelectedGame(null);
                setPlayers([]);
                setSubstitutes([]);
            }
        }
        else {
            setSelectedGame(null);
            setPlayers([]);
            setSubstitutes([]);
        }
    };
    // Update player information
    const updatePlayer = (index, field, value) => {
        const updatedPlayers = [...players];
        updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
        setPlayers(updatedPlayers);
    };
    // Update substitute information
    const updateSubstitute = (index, field, value) => {
        const updatedSubstitutes = [...substitutes];
        updatedSubstitutes[index] = { ...updatedSubstitutes[index], [field]: value };
        setSubstitutes(updatedSubstitutes);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTournament || !user || !profile) {
            setMessage({ type: 'error', text: 'Please select a tournament and ensure you are logged in' });
            return;
        }
        setIsSubmitting(true);
        setMessage(null);
        try {
            // Validate required team players for team-based tournaments
            if (selectedGame && selectedGame.rules.tournamentType !== 'individual') {
                const requiredPlayerCount = selectedGame.rules.minTeamSize - 1; // Excluding captain
                const filledPlayers = players.filter(p => p.name.trim() && p.email.trim());
                if (filledPlayers.length < requiredPlayerCount) {
                    setMessage({
                        type: 'error',
                        text: `Please fill in all required team players. You need ${requiredPlayerCount} additional players.`
                    });
                    setIsSubmitting(false);
                    return;
                }
            }
            // Filter and prepare team data
            const filteredPlayers = players.filter(p => p.name.trim() && p.email.trim());
            const filteredSubstitutes = substitutes.filter(s => s.name.trim() && s.email.trim());
            // Combine players and substitutes into a single structure
            const teamData = {
                players: filteredPlayers,
                substitutes: filteredSubstitutes
            };
            const registrationData = {
                tournamentId: selectedTournament,
                playerName: profile.fullname,
                email: user.email,
                university: profile.university || '',
                teamName: teamName.trim() || undefined,
                players: (filteredPlayers.length > 0 || filteredSubstitutes.length > 0) ? JSON.stringify(teamData) : undefined,
                additionalInfo: additionalInfo.trim() || undefined,
                status: 'pending',
                registrationDate: new Date().toISOString(),
                userId: user.$id
            };
            const appwrite = initializeAppwrite();
            if (!appwrite?.databases) {
                setMessage({ type: 'error', text: 'Database not configured. Please try again later.' });
                setIsSubmitting(false);
                return;
            }
            await appwrite.databases.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID, ID.unique(), registrationData);
            setMessage({
                type: 'success',
                text: 'Registration submitted successfully! Your registration is pending approval.'
            });
            // Reset form
            setSelectedTournament('');
            setTeamName('');
            setAdditionalInfo('');
            setPlayers([]);
            setSubstitutes([]);
            setSelectedGame(null);
        }
        catch (error) {
            console.error('Registration error:', error);
            if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
                setMessage({ type: 'error', text: 'You have already registered for this tournament' });
            }
            else {
                setMessage({ type: 'error', text: 'Failed to submit registration. Please try again.' });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (loading || checkingCaptainStatus) {
        return (<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>);
    }
    if (!user) {
        return null; // Will redirect to login
    }
    // Check if user is a team captain or admin
    if (!isTeamCaptain && !profile?.isAdmin) {
        return (<div className="min-h-screen bg-gray-900 text-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <h1 className="text-3xl font-bold text-[#961c18] mb-4">
                Team Captain Access Required
              </h1>
              <p className="text-gray-300 mb-6">
                Tournament registration is restricted to team captains only. This helps us manage team registrations more effectively and ensures proper coordination.
              </p>
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">How to become a team captain:</h3>
                <ul className="text-sm text-gray-300 space-y-1 text-left">
                  <li>• Contact your university's esports coordinator</li>
                  <li>• Join your game's captain WhatsApp group</li>
                  <li>• Get verified by the tournament administrators</li>
                  <li>• Your account will be updated with captain privileges</li>
                </ul>
              </div>
              <p className="text-sm text-gray-400">
                If you believe you should have team captain access, please contact the administrators.
              </p>
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#961c18]">
            Tournament Registration
          </h1>

          {/* User Info Display */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <p className="font-medium">{profile?.fullname}</p>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="font-medium">{user.email}</p>
              </div>
              {profile?.university && (<div>
                  <span className="text-gray-400">University:</span>
                  <p className="font-medium">{profile.university}</p>
                </div>)}
            </div>
          </div>

          {message && (<div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'}`}>
              {message.text}
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tournament Selection */}
            <div>
              <label htmlFor="tournament" className="block text-sm font-medium mb-2">
                Select Tournament *
              </label>
              {loadingTournaments ? (<div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#961c18] mx-auto"></div>
                </div>) : tournaments.length === 0 ? (<div className="bg-gray-700 rounded-lg p-4 text-center">
                  <p className="text-gray-400">No tournaments are currently open for registration.</p>
                </div>) : (<select id="tournament" value={selectedTournament} onChange={(e) => handleTournamentSelection(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white" required>
                  <option value="">Choose a tournament...</option>
                  {tournaments.map((tournament) => (<option key={tournament.$id} value={tournament.$id}>
                      {tournament.title || tournament.gameName}
                      {tournament.registrationDeadline && (` (Deadline: ${new Date(tournament.registrationDeadline).toLocaleDateString()})`)}
                    </option>))}
                </select>)}
            </div>

            {/* Dynamic Team Registration Section */}
            {selectedGame && (<div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#961c18]">
                  Team Registration - {selectedGame.name}
                </h3>
                
                {/* Game Format Info */}
                <div className="bg-gray-600 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Format:</span>
                      <p className="font-medium capitalize">{selectedGame.rules.tournamentType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Team Size:</span>
                      <p className="font-medium">
                        {selectedGame.rules.minTeamSize === selectedGame.rules.maxTeamSize
                ? selectedGame.rules.minTeamSize
                : `${selectedGame.rules.minTeamSize}-${selectedGame.rules.maxTeamSize}`} players
                      </p>
                    </div>
                    {selectedGame.rules.allowSubstitutes && (<div>
                        <span className="text-gray-400">Substitutes:</span>
                        <p className="font-medium">{selectedGame.rules.maxSubstitutes || 0} allowed</p>
                      </div>)}
                  </div>
                </div>

                {/* Team Captain (Current User) */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-green-400">Team Captain (You)</h4>
                  <div className="bg-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <p className="font-medium">{profile?.fullname}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">University:</span>
                        <p className="font-medium">{profile?.university}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Team Players */}
                {players.length > 0 && (<div className="mb-6">
                    <h4 className="font-semibold mb-3">Team Players</h4>
                    <div className="space-y-4">
                      {players.map((player, index) => (<div key={index} className="bg-gray-600 rounded-lg p-4">
                          <h5 className="font-medium mb-3">Player {index + 2}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Full Name *
                              </label>
                              <input type="text" value={player.name} onChange={(e) => updatePlayer(index, 'name', e.target.value)} placeholder="Enter player's full name" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400" required/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Email *
                              </label>
                              <input type="email" value={player.email} onChange={(e) => updatePlayer(index, 'email', e.target.value)} placeholder="Enter player's email" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400" required/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                University *
                              </label>
                              <input type="text" value={player.university} onChange={(e) => updatePlayer(index, 'university', e.target.value)} placeholder="Enter player's university" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400" required/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                In-Game ID
                              </label>
                              <input type="text" value={player.inGameId || ''} onChange={(e) => updatePlayer(index, 'inGameId', e.target.value)} placeholder="Enter in-game username/ID" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400"/>
                            </div>
                          </div>
                        </div>))}
                    </div>
                  </div>)}

                {/* Substitute Players */}
                {substitutes.length > 0 && (<div className="mb-6">
                    <h4 className="font-semibold mb-3">Substitute Players</h4>
                    <div className="space-y-4">
                      {substitutes.map((substitute, index) => (<div key={index} className="bg-gray-600 rounded-lg p-4">
                          <h5 className="font-medium mb-3">Substitute {index + 1}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Full Name
                              </label>
                              <input type="text" value={substitute.name} onChange={(e) => updateSubstitute(index, 'name', e.target.value)} placeholder="Enter substitute's full name" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400"/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Email
                              </label>
                              <input type="email" value={substitute.email} onChange={(e) => updateSubstitute(index, 'email', e.target.value)} placeholder="Enter substitute's email" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400"/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                University
                              </label>
                              <input type="text" value={substitute.university} onChange={(e) => updateSubstitute(index, 'university', e.target.value)} placeholder="Enter substitute's university" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400"/>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                In-Game ID
                              </label>
                              <input type="text" value={substitute.inGameId || ''} onChange={(e) => updateSubstitute(index, 'inGameId', e.target.value)} placeholder="Enter in-game username/ID" className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400"/>
                            </div>
                          </div>
                        </div>))}
                    </div>
                  </div>)}

                {/* Individual Player Note */}
                {selectedGame.rules.tournamentType === 'individual' && (<div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-blue-300 text-sm">
                        This is an individual tournament. You will compete as a solo player.
                      </p>
                    </div>
                  </div>)}
              </div>)}

            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium mb-2">
                Team Name (Optional)
              </label>
              <input type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter your team name if applicable" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400"/>
              <p className="text-xs text-gray-400 mt-1">
                Leave blank if you're registering as an individual player
              </p>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
                Additional Information (Optional)
              </label>
              <textarea id="additionalInfo" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Any additional information you'd like to provide..." rows={4} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white placeholder-gray-400 resize-vertical"/>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting || tournaments.length === 0} className="w-full py-3 px-4 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
              {isSubmitting ? (<div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>) : ('Submit Registration')}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Important Notes:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Your registration will be reviewed by administrators</li>
              <li>• You will be notified via email about your registration status</li>
              <li>• Make sure your profile information is up to date</li>
              <li>• Registration deadlines are strictly enforced</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);
}
