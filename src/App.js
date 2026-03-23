import React, { useState } from 'react';
import EnhancedSquadList from './EnhancedSquadList';
import FixtureList from './FixtureList';
import Stats from './Stats';

// Navigation Component
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
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
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

// Main App
function App() {
  const [activeView, setActiveView] = useState('squad');

  const renderView = () => {
    switch (activeView) {
      case 'squad':
        return <EnhancedSquadList />;
      case 'fixtures':
        return <FixtureList />;
      case 'stats':
        return <Stats />;
      default:
        return <EnhancedSquadList />;
    }
  };

  return (
    <div>
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
      />
      {renderView()}
    </div>
  );
}

export default App;