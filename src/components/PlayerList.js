import React, { useState, useEffect } from 'react';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', gender: 'male', level: 'beginner' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(stored);
  }, []);

  const savePlayers = (updated) => {
    setPlayers(updated);
    localStorage.setItem('players', JSON.stringify(updated));
  };

  const addPlayer = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    const newPlayer = {
      id: crypto.randomUUID(),
      ...form
    };
    const updated = [...players, newPlayer];
    savePlayers(updated);
    resetForm();
    window.location.reload();
  };

  const deletePlayer = (index) => {
    const updated = [...players];
    updated.splice(index, 1);
    savePlayers(updated);
    window.location.reload();
  };

  const openEditDialog = (index) => {
    const p = players[index];
    setEditingIndex(index);
    setForm({ firstName: p.firstName, lastName: p.lastName, gender: p.gender, level: p.level });
  };

  const saveEdit = () => {
    const updated = [...players];
    updated[editingIndex] = { ...updated[editingIndex], ...form };
    savePlayers(updated);
    resetForm();
    window.location.reload();
  };

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', gender: 'male', level: 'beginner' });
    setEditingIndex(null);
    setShowAddDialog(false);
  };

  const moveToWaiting2Play = (player, index) => {
    const waiting = JSON.parse(localStorage.getItem('waiting2play')) || [];
    waiting.push(player);
    localStorage.setItem('waiting2play', JSON.stringify(waiting));

    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    savePlayers(updatedPlayers);
    window.location.reload();
  };

  return (
    <div>
      <h2>Player List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((p, i) => (
          <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {`${p.firstName} ${p.lastName}`}
            <div>
              <button onClick={() => openEditDialog(i)} style={{ marginRight: '0.5rem' }}>Edit</button>
              <button onClick={() => deletePlayer(i)} style={{ marginRight: '0.5rem' }}>Delete</button>
              <button onClick={() => moveToWaiting2Play(p, i)}>Add to Wait</button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowAddDialog(true)}>Add Player</button>

      {(showAddDialog || editingIndex !== null) && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>{editingIndex !== null ? "Edit Player" : "Add Player"}</h3>
            <input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
         <select
  value={form.gender}
  onChange={(e) => setForm({ ...form, gender: e.target.value })}
>
  <option value="" disabled hidden>
    Select gender
  </option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>

<select
  value={form.level}
  onChange={(e) => setForm({ ...form, level: e.target.value })}
>
  <option value="" disabled hidden>
    Select level
  </option>
  <option value="beginner">Beginner</option>
  <option value="intermediate">Intermediate</option>
  <option value="advanced">Advanced</option>
</select>

            <div style={{ marginTop: '1rem' }}>
              <button onClick={editingIndex !== null ? saveEdit : addPlayer}>
                {editingIndex !== null ? 'Save' : 'Add'}
              </button>
              <button onClick={resetForm} style={{ marginLeft: '0.5rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  minWidth: '300px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

export default PlayerList;
