// Simple test to check if tournaments exist in the system
// Run this in the browser console or as a temporary API endpoint

// Test if we can access tournament management
try {
  const { tournamentManagement } = require('./src/lib/services/tournamentManagement');
  
  // Try to list tournaments
  tournamentManagement.list({ status: 'published' })
    .then(result => {
      console.log('TOURNAMENTS FOUND:', result);
      console.log('Count:', result.tournaments.length);
      result.tournaments.forEach((t, i) => {
        console.log(`${i+1}. ${t.title} (${t.gameName}) - ${t.status}`);
      });
    })
    .catch(error => {
      console.error('TOURNAMENT ERROR:', error);
    });
} catch (error) {
  console.error('IMPORT ERROR:', error);
}