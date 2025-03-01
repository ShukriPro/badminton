import React, { useState, useEffect } from 'react';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlayer, setNewPlayer] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    loadPlayers();
  }, []);

  // Load from localStorage
  const loadPlayers = () => {
    const stored = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(stored);
  };

  // Save to localStorage
  const savePlayers = (updated) => {
    setPlayers(updated);
    localStorage.setItem('players', JSON.stringify(updated));
  };

  // Add a new player (only to the players list)
  const addPlayer = () => {
    if (!newPlayer.trim()) return;
    const updated = [...players, newPlayer.trim()];
    savePlayers(updated);
    setNewPlayer('');
    setShowAddDialog(false);
    window.location.reload(); // Refresh UI
  };

  // Delete player
  const deletePlayer = (index) => {
    const updated = [...players];
    updated.splice(index, 1);
    savePlayers(updated);
    window.location.reload(); // Refresh UI
  };

  // Edit player
  const openEditDialog = (index) => {
    setEditingIndex(index);
    setEditingName(players[index]);
  };
  const closeEditDialog = () => {
    setEditingIndex(null);
    setEditingName('');
  };
  const saveEdit = () => {
    if (!editingName.trim()) return;
    const updated = [...players];
    updated[editingIndex] = editingName.trim();
    savePlayers(updated);
    closeEditDialog();
    window.location.reload(); // Refresh UI
  };

  // Move player from 'players' to 'waiting2play'
  const moveToWaiting2Play = (player, index) => {
    // 1. Add to waiting2play
    const waiting = JSON.parse(localStorage.getItem('waiting2play')) || [];
    waiting.push(player);
    localStorage.setItem('waiting2play', JSON.stringify(waiting));

    // 2. Remove from players
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    savePlayers(updatedPlayers);

    // 3. Refresh UI
    window.location.reload();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
      <h2>Player List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((player, i) => (
          <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {player}
            <div>
              <button onClick={() => openEditDialog(i)} style={{ marginRight: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => deletePlayer(i)} style={{ marginRight: '0.5rem' }}>
                Delete
              </button>
              <button onClick={() => moveToWaiting2Play(player, i)}>
                Add to Wait
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => setShowAddDialog(true)}>Add Player</button>

      {/* Add Dialog */}
      {showAddDialog && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>Add Player</h3>
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={addPlayer}>Add</button>
              <button onClick={() => setShowAddDialog(false)} style={{ marginLeft: '0.5rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingIndex !== null && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>Edit Player</h3>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={closeEditDialog} style={{ marginLeft: '0.5rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple overlay/dialog styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const dialogStyle = {
  background: '#fff',
  padding: '1rem',
  borderRadius: '4px',
  minWidth: '300px'
};

export default PlayerList;
