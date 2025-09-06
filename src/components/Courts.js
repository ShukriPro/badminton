import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [nextCourtId, setNextCourtId] = useState(1);

  useEffect(() => {
    const storedCourts = JSON.parse(localStorage.getItem('courts')) || [];
    if (storedCourts.length === 0) {
      const defaultCourts = [
        { id: 1, players: [] },
        { id: 2, players: [] },
        { id: 3, players: [] },
        { id: 4, players: [] }
      ];
      localStorage.setItem('courts', JSON.stringify(defaultCourts));
      setCourts(defaultCourts);
      setNextCourtId(5);
    } else {
      setCourts(storedCourts);
      const maxId = storedCourts.reduce((max, c) => (c.id > max ? c.id : max), 0);
      setNextCourtId(maxId + 1);
    }
  }, []);

  const saveCourts = (updated) => {
    setCourts(updated);
    localStorage.setItem('courts', JSON.stringify(updated));
  };

  const addCourt = () => {
    const newCourt = { id: nextCourtId, players: [] };
    const updated = [...courts, newCourt];
    saveCourts(updated);
    setNextCourtId(nextCourtId + 1);
    window.location.reload();
  };

  const removeCourt = (courtId) => {
    const updated = courts.filter(c => c.id !== courtId);
    saveCourts(updated);
    window.location.reload();
  };

  const courtStyle = {
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  };

  const buttonStyle = {
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    background: '#f8f8f8'
  };

  const playerNameStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '4px 8px',
    margin: '2px 0',
    backgroundColor: '#f9f9f9',
    display: 'block',
    fontWeight: 'bold',
    fontSize: '1.25rem'
  };

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
         listStyle: "none",
          padding: 0,
          overflowY: "auto",
          zoom: "0.8",
          marginBottom: "1rem",

        
      }}>
        {courts.map((court) => (
          <div key={court.id} style={courtStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Court: {court.id.toString().padStart(2, '0')}</strong>
              {court.players.length === 0 && (
                <button
                  style={{
                    ...buttonStyle,
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    padding: '4px'
                  }}
                  onClick={() => removeCourt(court.id)}
                  onMouseOver={(e) => e.currentTarget.querySelector('.tooltip').style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.querySelector('.tooltip').style.opacity = 0}
                >
                  <span className="tooltip" style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    pointerEvents: 'none'
                  }}>Remove Court</span>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ marginBottom: '8px' }}>

                {court.players.length > 0 ? (
                  court.players.map((p, index) => (
                    <div key={index} style={{
                      ...playerNameStyle,
                      backgroundColor: p.gender === 'female' ? '#ffe6e6' : p.gender === 'male' ? '#e6ffe6' : '#f9f9f9'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {`${p.firstName} ${p.lastName}`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                        {p.level ? p.level.charAt(0).toUpperCase() + p.level.slice(1) : 'No level'}
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#666' }}>No players assigned</span>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                {court.players.length < 2 && (
                  <span style={{ color: '#e53e3e' }}>Min 2 players</span>
                )}
                {court.players.length >= 4 && (
                  <span style={{ color: '#e53e3e' }}>Court full</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={addCourt} 
        style={{
          ...buttonStyle,
          padding: '10px 16px',
          textAlign: 'center',
          fontWeight: '500',
          marginTop: '12px',
          width: '100%'
        }}
      >
        Add Court +
      </button>
    </div>
  );
}

export default Courts;