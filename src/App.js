import React from "react";
import PlayerList from "./components/PlayerList";
import Waiting2play from "./components/WaitingQueue";
import Timer from "./components/Timer";
import Courts from "./components/Courts";

function App() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", height: "100vh", padding: "1rem" }}>
      
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
  );
}


export default App;
