import React, { useEffect } from "react";
import PlayerList from "./components/PlayerList";
import Waiting2play from "./components/WaitingQueue";
import Timer from "./components/Timer";
import Courts from "./components/Courts";
import { syncPlayersToFirestore } from "./components/syncPlayersToFirestore";
import PlayerBoard from "./PlayerBoard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
function App() {
  // Check if userId is already in localStorage, if not, generate a new one
  useEffect(() => {
    document.body.style.overflowX = "hidden"; // disable horizontal scroll

    if (!localStorage.getItem("userId")) {
      const userId = crypto.randomUUID(); // Generates a unique ID
      localStorage.setItem("userId", userId);
    }

    syncPlayersToFirestore();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                padding: "0.5rem",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 3fr",
                  gap: "1rem",
                  height: "100%",
                }}
              >
                <div
                  className="border rounded p-2"
                  
                >
                  <PlayerList />
                </div>
                <div className="border rounded p-2">
                  <Waiting2play />
                </div>
                <div className="border rounded p-2">
                  <Timer />
                </div>
                <div style={{ height: "100%", overflow: "hidden" }}>
                  <Courts />
                </div>
              </div>
            </div>
          }
        />
        <Route path="/playerboard/:id" element={<PlayerBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
