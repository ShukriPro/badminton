import React, { useState, useEffect } from 'react';

function WaitingQueue() {
  const [waitingPlayers, setWaitingPlayers] = useState([]);

  useEffect(() => {
    loadWaitingPlayers();
  }, []);

  // Load from localStorage
  const loadWaitingPlayers = () => {
    const stored = JSON.parse(localStorage.getItem('waiting2play')) || [];
    setWaitingPlayers(stored);
  };

  // Save to localStorage
  const saveWaitingPlayers = (updated) => {
    setWaitingPlayers(updated);
    localStorage.setItem('waiting2play', JSON.stringify(updated));
  };

  // Remove from waiting queue and return to main players list
  const removeFromWaiting = (index) => {
    const updated = [...waitingPlayers];
    const removedPlayer = updated.splice(index, 1)[0];
    saveWaitingPlayers(updated);
    moveToPlayersList(removedPlayer);
    window.location.reload(); // Refresh UI
  };

  const moveToPlayersList = (playerName) => {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    storedPlayers.push(playerName);
    localStorage.setItem('players', JSON.stringify(storedPlayers));
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
      <h2>Waiting Queue</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {waitingPlayers.map((player, i) => (
          <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {player}
            <button onClick={() => removeFromWaiting(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WaitingQueue;
