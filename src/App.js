import React from "react";
import PlayerList from "./components/PlayerList";
import Waiting2play from "./components/WaitingQueue";
import Timer from "./components/Timer";
import Courts from "./components/Courts";

function App() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr 200px", gap: "1rem", height: "100vh", padding: "1rem" }}>
      
      {/* Players */}
      <PlayerList/>

      {/* Waiting to Play */}
      <Waiting2play/>

      {/* Timer */}
      <Timer/>

      {/* Courts */}
      <Courts/> 

    </div>
  );
}

export default App;
