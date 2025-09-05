import React, { useEffect } from "react";
import PlayerList from "./components/PlayerList";
import Waiting2play from "./components/WaitingQueue";
import Timer from "./components/Timer";
import Courts from "./components/Courts";
import Header from "./components/Header";
import { syncPlayersToFirestore } from "./components/syncPlayersToFirestore";

function App() {
  // Check if userId is already in localStorage, if not, generate a new one
  useEffect(() => {
    document.body.style.overflowX = 'hidden'; // disable horizontal scroll

    if (!localStorage.getItem("userId")) {
      const userId = crypto.randomUUID(); // Generates a unique ID
      localStorage.setItem("userId", userId);
    }

    syncPlayersToFirestore();
  }, []);

  return (
    <div style={{
      padding: "0.1rem",
    }}>
      

      {/* Grid with four columns for the rest of the content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 3fr",
          gap: "1rem",
          height: "100vh",
          
          marginTop: "1rem",
        }}
      >
        <div className="border rounded p-2">
          <PlayerList />
        </div>
        <div className="border rounded p-2">
          <Waiting2play />
        </div>
        <div className="border rounded p-2">
          <Timer />
        </div>
        <Courts />
      </div>
    </div>
  );
}

export default App;
