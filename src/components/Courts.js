import React, { useEffect, useState } from 'react';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [nextCourtId, setNextCourtId] = useState(1);

  useEffect(() => {
    // Load courts from localStorage testing
    const storedCourts = JSON.parse(localStorage.getItem('courts')) || [];
    // If no courts exist, create 2 by default
    if (storedCourts.length === 0) {
      const defaultCourts = [
        { id: 1, players: [] },
        { id: 2, players: [] },
      ];
      localStorage.setItem('courts', JSON.stringify(defaultCourts));
      setCourts(defaultCourts);
      setNextCourtId(3);
    } else {
      setCourts(storedCourts);
      const maxId = storedCourts.reduce((max, c) => (c.id > max ? c.id : max), 0);
      setNextCourtId(maxId + 1);
    }
  }, []);

  // Save courts to localStorage
  const saveCourts = (updated) => {
    setCourts(updated);
    localStorage.setItem('courts', JSON.stringify(updated));
  };

  // Add Court
  const addCourt = () => {
    const newCourt = { id: nextCourtId, players: [] };
    const updated = [...courts, newCourt];
    saveCourts(updated);
    setNextCourtId(nextCourtId + 1);
    window.location.reload();
  };

  // Remove Court (only if empty)
  const removeCourt = (courtId) => {
    const updated = courts.filter(c => c.id !== courtId);
    saveCourts(updated);
    window.location.reload();
  };

  // Example placeholder for filling courts from waiting queue
  const handleTimerStart = () => {
    const waitingPlayers = JSON.parse(localStorage.getItem('waiting2play')) || [];
    const updatedCourts = [...courts];

    // Fill each court up to 4 players
    for (let i = 0; i < updatedCourts.length; i++) {
      while (updatedCourts[i].players.length < 4 && waitingPlayers.length > 0) {
        updatedCourts[i].players.push(waitingPlayers.shift());
      }
    }

    saveCourts(updatedCourts);
    localStorage.setItem('waiting2play', JSON.stringify(waitingPlayers));
  };

  // Example placeholder for moving players back to waiting queue
  const handleTimerEnd = () => {
    let waitingPlayers = JSON.parse(localStorage.getItem('waiting2play')) || [];
    const clearedCourts = courts.map(court => {
      waitingPlayers = [...waitingPlayers, ...court.players];
      return { ...court, players: [] };
    });

    saveCourts(clearedCourts);
    localStorage.setItem('waiting2play', JSON.stringify(waitingPlayers));
  };

  return (
    <div 
      style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr",  // Single column spanning full width
        gap: "1rem", 
        height: "100%" 
      }}
    >
      {/* Courts list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {courts.map((court) => (
          <div key={court.id} style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Court: {court.id.toString().padStart(2, '0')}</strong>
              {court.players.length === 0 && (
                <button onClick={() => removeCourt(court.id)}>
                  Remove Court
                </button>
              )}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              Players: {court.players.join(', ')}
            </div>
            <div>
              {court.players.length < 2 && <span style={{ color: "red" }}>Min 2 players</span>}{' '}
              {court.players.length >= 4 && <span style={{ color: "red" }}>Court full</span>}
            </div>
          </div>
        ))}
        <button onClick={addCourt} style={{ padding: "0.5rem" }}>
          Add Court +
        </button>
      </div>
    </div>
  );
}

export default Courts;
