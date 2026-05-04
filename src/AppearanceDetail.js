import React, { useState, useEffect } from 'react';
import { getPlayerAppearanceDetails } from './fixturestatscalculator';

function AppearanceDetail({ player, fixtures = [], onBack }) {
  const [appearanceDetails, setAppearanceDetails] = useState([]);

  useEffect(() => {
    if (fixtures.length > 0) {
      const details = getPlayerAppearanceDetails(fixtures, player.fullName);
      setAppearanceDetails(details);
    }
  }, [fixtures, player]);

  const getPerformanceSummary = () => {
    if (player.starterPercentage >= 80) {
      return `Regular starter with ${player.totalStarts} starts from ${player.totalAppearances} appearances. Completed ${player.completionRate}% of matches started.`;
    } else if (player.starterPercentage >= 50) {
      return `Frequent starter with ${player.totalStarts} starts and ${player.totalSubstitutes} substitute appearances. ${player.completionRate}% completion rate.`;
    } else if (player.totalSubstitutes > player.totalStarts) {
      return `Impact substitute with ${player.totalSubstitutes} substitute appearances and ${player.totalStarts} starts.`;
    } else {
      return `Squad player with ${player.totalAppearances} total appearances across the season.`;
    }
  };

  const formatResult = (result, homeOrAway) => {
    if (!result) return 'Result unknown';
    const cleanResult = result.replace(/\s+/g, ' ').trim();
    return homeOrAway === 'Away' ? `${cleanResult} (A)` : `${cleanResult} (H)`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#003f7f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        &larr; Back to Appearances
      </button>

      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#003f7f', textAlign: 'center', marginBottom: '30px' }}>
        {player.forename} {player.surname}
      </div>

      <div style={{ backgroundColor: '#003f7f', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
        <span>Total appearances</span>
        <span>{player.totalAppearances}</span>
      </div>

      <div style={{ backgroundColor: '#003f7f', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', fontWeight: 'bold' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Starts</span><span>{player.totalStarts}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Substitute appearances</span><span>{player.totalSubstitutes}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Completed matches</span><span>{player.completedMatches}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Substituted off</span><span>{player.substitutedOff}</span>
        </div>
      </div>

      <div style={{ backgroundColor: '#28a745', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
        <div style={{ marginBottom: '8px', fontSize: '16px' }}>Performance Summary</div>
        <div style={{ lineHeight: '1.5', fontWeight: 'normal' }}>{getPerformanceSummary()}</div>
      </div>

      <div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#003f7f', marginBottom: '15px', borderBottom: '2px solid #003f7f', paddingBottom: '5px' }}>
          Match-by-Match Appearances ({appearanceDetails.length})
        </div>

        {appearanceDetails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#6c757d' }}>
            No appearance details available
          </div>
        ) : (
          appearanceDetails.map((appearance, index) => (
            <div key={index} style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#003f7f' }}>
                    {appearance.opponent} {formatResult(appearance.result, appearance.homeOrAway)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '2px' }}>
                    {appearance.date} &middot; {appearance.competition}
                  </div>
                  <div style={{ fontSize: '14px', marginTop: '4px', color: appearance.role === 'Started' ? '#28a745' : '#17a2b8', fontWeight: 'bold' }}>
                    {appearance.role === 'Started' ? (
                      appearance.wasSubstituted ?
                        `Started &bull; Substituted off ${appearance.substitutionTime}` :
                        'Started \u2022 Completed match'
                    ) : (
                      `Substitute \u2022 Came on ${appearance.cameOnTime}`
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AppearanceDetail;