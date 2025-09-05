import React, { useState } from 'react';

const Header = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', gender: '', level: '' });
  const [touched, setTouched] = useState({ firstName: false, lastName: false, gender: false, level: false });
  
  const menuItems = [
    { id: 'add-player', label: 'Add Player' },

  ];
  
  const resetForm = () => {
    setForm({ firstName: '', lastName: '', gender: '', level: '' });
    setTouched({ firstName: false, lastName: false, gender: false, level: false });
    setShowAddDialog(false);
  };
  
  const addPlayer = () => {
    setTouched({ firstName: true, lastName: true, gender: true, level: true });
    
    if (!form.firstName.trim() || !form.lastName.trim() || !form.gender || !form.level) return;
    
    // Create a new player with unique ID
    const newPlayer = {
      id: crypto.randomUUID(),
      ...form
    };
    
    // Get existing players from localStorage
    const existingPlayers = JSON.parse(localStorage.getItem('players')) || [];
    
    // Add the new player to the array
    const updatedPlayers = [...existingPlayers, newPlayer];
    
    // Save back to localStorage
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    
    console.log('Player added:', newPlayer);
    resetForm();
    
    // Reload the page to update the player list
    window.location.reload();
  };
  
  const handleMenuClick = (item) => {
    if (item.id === 'add-player') {
      setShowAddDialog(true);
    }
  };
  
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const dialogStyle = {
    background: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };
  
  const buttonStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '4px 10px',
    margin: '0 4px',
    background: '#f8f8f8',
    cursor: 'pointer',
    width: '100%'
  };
  
  return (
    <>
      <header style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              style={{ ...buttonStyle, width: '100%' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      
      {showAddDialog && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>Add Player</h3>
            
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
                padding: '6px',
                borderColor: touched.firstName && !form.firstName.trim() ? 'red' : '#ccc',
                borderWidth: touched.firstName && !form.firstName.trim() ? '2px' : '1px',
                borderRadius: '4px'
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
                padding: '6px',
                borderColor: touched.lastName && !form.lastName.trim() ? 'red' : '#ccc',
                borderWidth: touched.lastName && !form.lastName.trim() ? '2px' : '1px',
                borderRadius: '4px'
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
                padding: '6px',
                color: form.gender ? 'black' : 'grey',
                borderColor: touched.gender && !form.gender ? 'red' : '#ccc',
                borderWidth: touched.gender && !form.gender ? '2px' : '1px',
                borderRadius: '4px'
              }}
            >
              <option value="" disabled style={{ color: 'grey' }}>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
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
                padding: '6px',
                color: form.level ? 'black' : 'grey',
                borderColor: touched.level && !form.level ? 'red' : '#ccc',
                borderWidth: touched.level && !form.level ? '2px' : '1px',
                borderRadius: '4px'
              }}
            >
              <option value="" disabled style={{ color: 'grey' }}>Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={addPlayer}
                style={buttonStyle}
              >
                Add
              </button>
              <button 
                onClick={resetForm}
                style={buttonStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;