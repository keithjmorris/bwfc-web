import React, { useState, useEffect } from 'react';
import PlayerDetail from './PlayerDetail';

function EnhancedSquadList({ fixtures = [] }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Available');
  const [competitionFilter, setCompetitionFilter] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchSquad = async () => {
      try {
        const squadResponse = await fetch('https://api.jsonbin.io/v3/b/69cebe3e856a682189f3e5f4/latest');
        const squadData = await squadResponse.json();
        const squadArray = squadData.record.filter(p => p.notes !== 'Total');
        setPlayers(squadArray);
      } catch (error) {
        console.error('Error fetching squad:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSquad();
  }, []);

  const getRelevantFixtures = () => {
    if (competitionFilter === 'All') return fixtures;
    if (competitionFilter === 'League') return fixtures.filter(f => f.competition === 'EFL League One');
    return fixtures.filter(f => f.competition !== 'EFL League One');
  };

  const playerAppearedInCompetition = (player) => {
    if (competitionFilter === 'All') return true;
    const playerRef = `${player.forename.charAt(0)}. ${player.surname}`;
    const relevantFixtures = getRelevantFixtures();
    return relevantFixtures.some(fixture => {
      for (let i = 1; i <= 11; i++) {
        if (fixture[`starter${i}`] && fixture[`starter${i}`].includes(playerRef)) return true;
      }
      for (let i = 1; i <= 5; i++) {
        if (fixture[`substitute${i}`] && fixture[`substitute${i}`].includes(playerRef)) return true;
      }
      return false;
    });
  };

  const getPlayerGoals = (player) => {
    let totalGoals = 0;
    const relevantFixtures = getRelevantFixtures();
    relevantFixtures.forEach(fixture => {
      for (let i = 1; i <= 8; i++) {
        const scorer = fixture[`scorer${i}`];
        if (scorer && scorer.includes(`${player.forename.charAt(0)}. ${player.surname}`)) {
          const matches = scorer.match(/\d+'/g);
          totalGoals += matches ? matches.length : 1;
        }
      }
    });
    return totalGoals;
  };

  const getPlayerStatistics = (player) => {
    let stats = { appearances: 0, starts: 0, substitutes: 0, yellowCards: 0, redCards: 0 };
    const relevantFixtures = getRelevantFixtures();
    relevantFixtures.forEach(fixture => {
      let appeared = false;
      for (let i = 1; i <= 11; i++) {
        const starter = fixture[`starter${i}`];
        if (starter && starter.includes(`${player.forename.charAt(0)}. ${player.surname}`)) {
          stats.appearances++; stats.starts++; appeared = true; break;
        }
      }
      if (!appeared) {
        for (let i = 1; i <= 5; i++) {
          const substitute = fixture[`substitute${i}`];
          if (substitute && substitute.includes(`${player.forename.charAt(0)}. ${player.surname}`)) {
            stats.appearances++; stats.substitutes++; break;
          }
        }
      }
      for (let i = 1; i <= 6; i++) {
        const yellowCard = fixture[`yellowCard${i}`];
        if (yellowCard && yellowCard.includes(`${player.forename.charAt(0)}. ${player.surname}`)) stats.yellowCards++;
      }
      for (let i = 1; i <= 2; i++) {
        const redCard = fixture[`redCard${i}`];
        if (redCard && redCard.includes(`${player.forename.charAt(0)}. ${player.surname}`)) stats.redCards++;
      }
    });
    return stats;
  };

  const calculateTeamTotals = (filteredPlayers) => {
    const relevantFixtures = getRelevantFixtures();
    return filteredPlayers.reduce((totals, player) => {
      const goals = getPlayerGoals(player);
      const stats = getPlayerStatistics(player);
      totals.totalGoals += goals;
      totals.totalCards += stats.yellowCards + stats.redCards;
      return totals;
    }, {
      totalGoals: 0,
      totalCards: 0,
      activePlayers: filteredPlayers.length,
      fixturesPlayed: relevantFixtures.filter(f => f.result && f.result !== '').length
    });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading squad...</div>;

  if (selectedPlayer) {
    return (
      <PlayerDetail
        player={selectedPlayer}
        fixtures={fixtures}
        onBack={() => setSelectedPlayer(null)}
      />
    );
  }

  const filteredPlayers = players.filter(player => {
    const statusMatch = (() => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Available') return player.notes === 'Squad' || player.notes === 'Loan in';
      return player.notes === statusFilter;
    })();
    const competitionMatch = playerAppearedInCompetition(player);
    return statusMatch && competitionMatch;
  });

  const teamTotals = calculateTeamTotals(filteredPlayers);

  const statBlock = (value, label, bgColor, textColor) => (
    <div style={{
      backgroundColor: bgColor, borderRadius: '8px', padding: '12px 8px',
      textAlign: 'center', flex: 1, minWidth: '80px'
    }}>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: textColor }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>

      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <img src="/BWFC_logo2.jpeg" alt="Bolton Wanderers FC"
          style={{ width: '120px', height: '120px', objectFit: 'contain', userSelect: 'none', WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        />
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#003f7f', marginBottom: '4px', textAlign: 'center' }}>
        Squad 2025/26
      </h1>

      <div style={{ border: '2px solid #4682b4', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', backgroundColor: '#fff' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#003f7f', marginBottom: '14px' }}>Team Totals</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {statBlock(teamTotals.totalGoals, 'Total Goals', '#ddeeff', '#1976d2')}
          {statBlock(teamTotals.totalCards, 'Total Cards', '#fdefd4', '#e65100')}
          {statBlock(teamTotals.activePlayers, 'Active Players', '#dff0df', '#2e7d32')}
          {statBlock(teamTotals.fixturesPlayed, 'Fixtures Played', '#f0f0f0', '#444')}
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#003f7f', fontSize: '14px' }}>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', cursor: 'pointer' }}>
            <option value="Available">Available (Squad + Loan in)</option>
            <option value="All">All Players</option>
            <option value="Squad">Squad</option>
            <option value="Loan in">Loan in</option>
            <option value="On loan">On loan</option>
            <option value="Gone">Gone</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#003f7f', fontSize: '14px' }}>Competition:</label>
          <select value={competitionFilter} onChange={(e) => setCompetitionFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', cursor: 'pointer' }}>
            <option value="All">All Competitions</option>
            <option value="League">EFL League One</option>
            <option value="Other">All Other Competitions</option>
          </select>
        </div>
      </div>

      {filteredPlayers.map(player => {
        const goals = getPlayerGoals(player);
        const stats = getPlayerStatistics(player);
        const relevantFixtures = getRelevantFixtures();
        const playedFixtures = relevantFixtures.filter(f => f.result && f.result !== '');
        const participationPercentage = playedFixtures.length > 0
          ? Math.round((stats.appearances / playedFixtures.length) * 100)
          : 0;
        const totalCards = stats.yellowCards + stats.redCards;

        return (
          <div key={player.id} onClick={() => setSelectedPlayer(player)}
            style={{
              border: '1px solid #ddd', cursor: 'pointer', borderRadius: '10px',
              padding: '16px', marginBottom: '14px', backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#003f7f' }}>
                  {player.forename} {player.surname}
                </div>
                <div style={{ fontSize: '13px', color: '#777' }}>
                  Status: <span style={{ color: '#cc0000', fontWeight: 'bold' }}>{player.notes}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {statBlock(goals, 'Goals', '#ddeeff', '#1976d2')}
              {statBlock(stats.appearances, 'Appearances', '#dff0df', '#2e7d32')}
              {statBlock(stats.starts, 'Starts', '#f3e8f8', '#7b1fa2')}
              {statBlock(stats.substitutes, 'Sub Apps', '#dff0df', '#2e7d32')}
              {statBlock(totalCards, 'Cards', '#fdefd4', '#e65100')}
              {statBlock(`${participationPercentage}%`, 'Season %', '#f0f0f0', '#444')}
            </div>
          </div>
        );
      })}

      {filteredPlayers.length === 0 && (
        <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '40px' }}>
          No players found for the selected filters.
        </div>
      )}
    </div>
  );
}

export default EnhancedSquadList;