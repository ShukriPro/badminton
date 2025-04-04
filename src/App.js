import React from "react";
import PlayerList from "./components/PlayerList";
import Waiting2play from "./components/WaitingQueue";
import Timer from "./components/Timer";
import Courts from "./components/Courts";
import Header from "./components/Header";

function App() {
  return (
    <div style={{
      padding: "1rem",
    }}>
      {/* Full width header */}
      <Header />

      {/* Grid with four columns for the rest of the content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
