import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from './Header';
function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', gender: '', level: '' });
  const [touched, setTouched] = useState({ firstName: false, lastName: false, gender: false, level: false });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(stored);
  }, []);

  const savePlayers = (updated) => {
    setPlayers(updated);
    localStorage.setItem('players', JSON.stringify(updated));
  };

  const addPlayer = () => {
    // Mark all fields as touched
    setTouched({ firstName: true, lastName: true, gender: true, level: true });
    
    if (!form.firstName.trim() || !form.lastName.trim() || !form.gender || !form.level) return;
    const newPlayer = {
      id: crypto.randomUUID(),
      ...form
    };
    const updated = [...players, newPlayer];
    savePlayers(updated);
    resetForm();
    window.location.reload();
  };

  const openDeleteDialog = (index) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };
  
  const deletePlayer = () => {
    const updated = [...players];
    updated.splice(deleteIndex, 1);
    savePlayers(updated);
    setShowDeleteDialog(false);
    window.location.reload();
  };

  const openEditDialog = (index) => {
    const p = players[index];
    setEditingIndex(index);
    setForm({ firstName: p.firstName, lastName: p.lastName, gender: p.gender, level: p.level });
    setShowDeleteDialog(false);
  };

  const saveEdit = () => {
    // Mark all fields as touched
    setTouched({ firstName: true, lastName: true, gender: true, level: true });
    
    if (!form.firstName.trim() || !form.lastName.trim() || !form.gender || !form.level) return;
    
    const updated = [...players];
    updated[editingIndex] = { ...updated[editingIndex], ...form };
    savePlayers(updated);
    resetForm();
    window.location.reload();
  };

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', gender: '', level: '' });
    setTouched({ firstName: false, lastName: false, gender: false, level: false });
    setEditingIndex(null);
    setShowAddDialog(false);
    setShowDeleteDialog(false);
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

  const iconButtonStyle = {
    background: 'none',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontSize: '18px'
  };

  const tooltipStyle = {
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
  };
  
  // Filter players based on search term
  const filteredPlayers = players.filter(player => {
    if (!player) return false;
    const fullName = `${player.firstName || ''} ${player.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Full width header */}
      <Header />
      <div style={{ marginBottom: '0.1rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%',
            padding: '8px',
            paddingRight: '32px', // Make room for the icon on the right
            borderRadius: '4px',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            marginBottom: '1rem'
          }}
        />
        <div style={{ 
          position: 'absolute', 
          right: '10px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          marginTop: '-8px', // Adjust for marginBottom of input
          color: '#666'
        }}>
          <Search size={18} />
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredPlayers.map((p, i) => {
          // Find the original index in the players array
          const originalIndex = players.findIndex(player => player.id === p.id);
          return (
            <li 
              key={p.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem', 
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: p.gender === 'female' ? '#ffe6e6' : p.gender === 'male' ? '#e6ffe6' : '#f9f9f9'
              }}
            >
              <div>
                <strong style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{`${p.firstName} ${p.lastName}`}</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                  {p.level ? p.level.charAt(0).toUpperCase() + p.level.slice(1) : 'No level'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => openEditDialog(originalIndex)} 
                  style={iconButtonStyle}
                  onMouseOver={(e) => e.currentTarget.querySelector('.tooltip').style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.querySelector('.tooltip').style.opacity = 0}
                >
                  <span className="tooltip" style={tooltipStyle}>Edit</span>
                  ✏️
                </button>
                <button 
                  onClick={() => moveToWaiting2Play(p, originalIndex)} 
                  style={iconButtonStyle}
                  onMouseOver={(e) => e.currentTarget.querySelector('.tooltip').style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.querySelector('.tooltip').style.opacity = 0}
                >
                  <span className="tooltip" style={tooltipStyle}>Add to Wait</span>
                  🏸
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {filteredPlayers.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
          {players.length === 0 ? 'No players available' : 'No players match your search'}
        </div>
      )}

      {(showAddDialog || editingIndex !== null) && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>{editingIndex !== null ? "Edit Player" : "Add Player"}</h3>
            <input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized = value 
                  ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                  : '';
                setForm({ ...form, firstName: capitalized });
                setTouched({ ...touched, firstName: true });
              }}
              onBlur={() => setTouched({ ...touched, firstName: true })}
              style={{ 
                borderColor: touched.firstName && !form.firstName.trim() ? 'red' : null,
                borderWidth: touched.firstName && !form.firstName.trim() ? '2px' : null
              }}
            />
            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized = value 
                  ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                  : '';
                setForm({ ...form, lastName: capitalized });
                setTouched({ ...touched, lastName: true });
              }}
              onBlur={() => setTouched({ ...touched, lastName: true })}
              style={{ 
                borderColor: touched.lastName && !form.lastName.trim() ? 'red' : null,
                borderWidth: touched.lastName && !form.lastName.trim() ? '2px' : null
              }}
            />
            <select
              value={form.gender}
              onChange={(e) => {
                setForm({ ...form, gender: e.target.value });
                setTouched({ ...touched, gender: true });
              }}
              onBlur={() => setTouched({ ...touched, gender: true })}
              required
              style={{ 
                color: form.gender ? 'black' : 'grey',
                borderColor: touched.gender && !form.gender ? 'red' : null,
                borderWidth: touched.gender && !form.gender ? '2px' : null
              }}
            >
              <option value="" disabled style={{ color: 'grey' }}>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select
              value={form.level}
              onChange={(e) => {
                setForm({ ...form, level: e.target.value });
                setTouched({ ...touched, level: true });
              }}
              onBlur={() => setTouched({ ...touched, level: true })}
              required
              style={{ 
                color: form.level ? 'black' : 'grey',
                borderColor: touched.level && !form.level ? 'red' : null,
                borderWidth: touched.level && !form.level ? '2px' : null
              }}
            >
              <option value="" disabled style={{ color: 'grey' }}>Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={editingIndex !== null ? saveEdit : addPlayer}
                style={{ 
                  border: '1px solid rgba(0, 0, 0, 0.15)', 
                  borderRadius: '4px', 
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: '#f8f8f8'
                }}
              >
                {editingIndex !== null ? 'Save' : 'Add'}
              </button>
              {editingIndex !== null && (
                <button 
                  onClick={() => openDeleteDialog(editingIndex)} 
                  style={{ 
                    marginLeft: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.15)', 
                    borderRadius: '4px', 
                    padding: '6px 12px',
                    cursor: 'pointer',
                    background: '#f8f8f8'
                  }}
                >
                  Delete
                </button>
              )}
              <button 
                onClick={resetForm} 
                style={{ 
                  marginLeft: '0.5rem',
                  border: '1px solid rgba(0, 0, 0, 0.15)', 
                  borderRadius: '4px', 
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: '#f8f8f8'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteDialog && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>Delete Player</h3>
            <p>Are you sure you want to delete this player?</p>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={deletePlayer} 
                style={{ 
                  marginRight: '0.5rem',
                  border: '1px solid rgba(0, 0, 0, 0.15)', 
                  borderRadius: '4px', 
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: '#f8f8f8'
                }}
              >
                Yes
              </button>
              <button 
                onClick={resetForm}
                style={{ 
                  border: '1px solid rgba(0, 0, 0, 0.15)', 
                  borderRadius: '4px', 
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: '#f8f8f8'
                }}
              >
                No
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