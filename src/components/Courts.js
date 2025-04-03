import React, { useEffect, useState } from 'react';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [nextCourtId, setNextCourtId] = useState(1);

  useEffect(() => {
    const storedCourts = JSON.parse(localStorage.getItem('courts')) || [];
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

  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      <div className="flex flex-col gap-4">
        {courts.map((court) => (
          <div key={court.id} className="border p-2 rounded">
            <div className="flex justify-between items-center">
              <strong>Court: {court.id.toString().padStart(2, '0')}</strong>
              {court.players.length === 0 && (
                <button
                  className="border px-2 py-1 text-sm"
                  onClick={() => removeCourt(court.id)}
                >
                  Remove Court
                </button>
              )}
            </div>
            <div className="mt-2">
              Players: {court.players.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
            </div>
            <div className="text-sm mt-1">
              {court.players.length < 2 && (
                <span className="text-red-500">Min 2 players</span>
              )}
              {court.players.length >= 4 && (
                <span className="text-red-500">Court full</span>
              )}
            </div>
          </div>
        ))}
        <button onClick={addCourt} className="border px-2 py-1">
          Add Court +
        </button>
      </div>
    </div>
  );
}

export default Courts;
