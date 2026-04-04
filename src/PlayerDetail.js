import React from 'react';

function PlayerDetail({ player, fixtures = [], onBack }) {

  const formatDate = (dateString) => {
    return dateString || 'N/A';
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const parts = dobString.split('/');
    if (parts.length !== 3) return 'N/A';
    const dob = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years} years, ${months} months`;
  };

  const getGoalsInCompetition = (competition) => {
    let goals = 0;
    const playerRef = `${player.forename.charAt(0)}. ${player.surname}`;
    fixtures
      .filter(f => competition === 'All' || f.competition === competition)
      .forEach(fixture => {
        for (let i = 1; i <= 8; i++) {
          const scorer = fixture[`scorer${i}`];
          if (scorer && scorer.includes(playerRef)) {
            const matches = scorer.match(/\d+'/g);
            goals += matches ? matches.length : 1;
          }
        }
      });
    return goals;
  };

  const totalGoals = getGoalsInCompetition('All');
  const leagueGoals = getGoalsInCompetition('EFL League One');
  const faCupGoals = getGoalsInCompetition('FA Cup');
  const eflCupGoals = getGoalsInCompetition('Caraboa League Cup');
  const eflTrophyGoals = getGoalsInCompetition('EFL League Trophy') + getGoalsInCompetition('Vertu EFL Trophy');

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#003f7f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        &larr; Back to Squad
      </button>

      {/* Player name */}
      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#003f7f',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        {player.forename} {player.surname}
      </div>

      {/* Basic Info */}
      <div style={{
        backgroundColor: '#003f7f',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '10px',
        fontWeight: 'bold'
      }}>
        <div style={{ color: '#ffc107', marginBottom: '10px', fontSize: '16px' }}>Basic Information</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Status:</span>
          <span style={{ color: '#ff6b6b' }}>{player.notes}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Date of Birth:</span>
          <span>{formatDate(player.DOB)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Age:</span>
          <span>{calculateAge(player.DOB)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Contract Start:</span>
          <span>{formatDate(player.contractStartDate)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Contract End:</span>
          <span>{formatDate(player.contractEndDate)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Rating:</span>
          <span>{player.rating || 'Not rated'}</span>
        </div>
      </div>

      {/* Goal Statistics â€” calculated from fixtures */}
      <div style={{
        backgroundColor: '#003f7f',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '10px',
        fontWeight: 'bold'
      }}>
        <div style={{ color: '#ffc107', marginBottom: '10px', fontSize: '16px' }}>Goal Statistics</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Total Goals:</span>
          <span>{totalGoals}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>League:</span>
          <span>{leagueGoals}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>FA Cup:</span>
          <span>{faCupGoals}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>EFL Cup:</span>
          <span>{eflCupGoals}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>EFL Trophy:</span>
          <span>{eflTrophyGoals}</span>
        </div>
      </div>

    </div>
  );
}

export default PlayerDetail;