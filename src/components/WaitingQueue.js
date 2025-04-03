import React, { useState, useEffect } from 'react';

function WaitingQueue() {
  const [waitingPlayers, setWaitingPlayers] = useState([]);

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
      <h2>Waiting Queue</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {waitingPlayers.map((player, i) => (
          <li key={player.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {`${player.firstName} ${player.lastName} (${player.gender}, ${player.level})`}
            <button onClick={() => removeFromWaiting(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WaitingQueue;
