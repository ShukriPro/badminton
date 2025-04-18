import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function WaitingQueue() {
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    loadWaitingPlayers();
  }, []);

  const loadWaitingPlayers = () => {
    const stored = JSON.parse(localStorage.getItem('waiting2play')) || [];
    setWaitingPlayers(stored);
  };

  const saveWaitingPlayers = (updated) => {
    setWaitingPlayers(updated);
    localStorage.setItem('waiting2play', JSON.stringify(updated));
  };

  const removeFromWaiting = (index) => {
    const updated = [...waitingPlayers];
    const removedPlayer = updated.splice(index, 1)[0];
    saveWaitingPlayers(updated);
    moveToPlayersList(removedPlayer);
    window.location.reload();
  };

  const moveToPlayersList = (playerObj) => {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    storedPlayers.push(playerObj);
    localStorage.setItem('players', JSON.stringify(storedPlayers));
  };

  return (
    <div>
      {waitingPlayers.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
          No players in the waiting queue
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {waitingPlayers.map((player, i) => (
            <li 
              key={player.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                alignItems: 'center'
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={{ flexGrow: 1 }}>
                {`${player.firstName} ${player.lastName}`}
                {hoveredIndex === i && (
                  <div style={{ 
                    position: 'absolute', 
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    color: 'white', 
                    padding: '5px',
                    borderRadius: '4px',
                    fontSize: '0.8em',
                    marginTop: '5px',
                    marginLeft: '10px'
                  }}>
                    Remove from queue
                  </div>
                )}
              </div>
              <button 
                onClick={() => removeFromWaiting(i)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} color="red" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WaitingQueue;