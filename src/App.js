import React, { useState, useEffect } from 'react';
import EnhancedSquadList from './EnhancedSquadList';
import FixtureList from './FixtureList';
import Stats from './Stats';

function Navigation({ activeView, onViewChange }) {
  const navItems = [
    { key: 'squad', label: 'Squad' },
    { key: 'fixtures', label: 'Fixtures' },
    { key: 'stats', label: 'Stats' }
  ];

  return (
    <nav style={{
      backgroundColor: '#003f7f',
      padding: '15px 20px',
      marginBottom: '0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            style={{
              backgroundColor: activeView === item.key ? '#ffffff' : 'transparent',
              color: activeView === item.key ? '#003f7f' : '#ffffff',
              border: activeView === item.key ? 'none' : '2px solid #ffffff',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function App() {
  const [activeView, setActiveView] = useState('squad');
  const [fixtures, setFixtures] = useState([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/keithjmorris/bwfc-web/main/data/fixtures.json');
const data = await response.json();
setFixtures(data);
      } catch (error) {
        console.error('Error fetching fixtures:', error);
      } finally {
        setFixturesLoading(false);
      }
    };
    fetchFixtures();
  }, []);

  if (fixturesLoading) return <div style={{ padding: '20px' }}>Loading...</div>;

  const renderView = () => {
    switch (activeView) {
      case 'squad':
        return <EnhancedSquadList fixtures={fixtures} />;
      case 'fixtures':
        return <FixtureList fixtures={fixtures} />;
      case 'stats':
        return <Stats fixtures={fixtures} />;
      default:
        return <EnhancedSquadList fixtures={fixtures} />;
    }
  };

  return (
    <div>
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      {renderView()}
    </div>
  );
}

export default App;