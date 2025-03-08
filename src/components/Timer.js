import React, { useEffect, useState, useRef } from "react";
import alertSound from "../sounds/alert.mp3";
function Timer() {
  // Default 15 minutes (900 seconds)
  const defaultTime = 15 * 60;

  // Load timeLeft from localStorage or default
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("timeLeft");
    return storedTime ? parseInt(storedTime, 10) : defaultTime;
  });

  // Load isRunning from localStorage or default false
  const [isRunning, setIsRunning] = useState(() => {
    const storedRunning = localStorage.getItem("isRunning");
    return storedRunning === "true";
  });

  // For the "Edit Timer" dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editMinutes, setEditMinutes] = useState(15);

  const audioRef = useRef(new Audio(alertSound)); // Store audio reference

  useEffect(() => {
    let timerId;
  
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
  
      // Play alert sound 1 min before time ends (only if user has interacted)
      if (timeLeft === 60) {
        audioRef.current.play().catch(error => console.log("Audio play blocked:", error));
      }
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      localStorage.setItem("isRunning", "false");
  
      // Move players first, then reset timer
      movePlayersBackToWaiting();
      window.location.reload();
      setTimeout(() => {
        setTimeLeft(defaultTime); // Reset timer after moving players
        localStorage.setItem("timeLeft", defaultTime.toString());
      }, 100); // Delay to ensure movePlayersBackToWaiting completes
    }
  
    return () => clearInterval(timerId);
  }, [isRunning, timeLeft]);
  
  // Ensure audio is allowed after first user interaction
  const enableAudio = () => {
    audioRef.current.play().then(() => {
      audioRef.current.pause(); // Pause after playing once
      audioRef.current.currentTime = 0;
    }).catch(error => console.log("Audio enable failed:", error));
  };

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft.toString());
    localStorage.setItem("isRunning", isRunning.toString());
  }, [timeLeft, isRunning]);

  // Format seconds as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start / Pause
  // If transitioning from paused -> running, fill courts from waiting2play
  // Then toggle isRunning
  const handleStartPause = () => {
    if (!isRunning) {
      // Paused -> Running
      movePlayersToCourtsRandomly();
      setIsRunning(true);
      localStorage.setItem("isRunning", "true");
      localStorage.setItem("timeLeft", timeLeft.toString());
    } else {
      // Running -> Paused
      setIsRunning(false);
      localStorage.setItem("isRunning", "false");
      localStorage.setItem("timeLeft", timeLeft.toString());
    }
  };

  // Reset
  // 1) Move players back to waiting
  // 2) Reset timer
  // 3) Pause
  // 4) Reload page
  const handleReset = () => {
    movePlayersBackToWaiting();
    setTimeLeft(defaultTime);
    setIsRunning(false);

    localStorage.setItem("timeLeft", defaultTime.toString());
    localStorage.setItem("isRunning", "false");

    window.location.reload();
  };

  // Move players from waiting2play -> courts (randomly) up to 4 per court
  const movePlayersToCourtsRandomly = () => {
    let waiting = JSON.parse(localStorage.getItem("waiting2play")) || [];
    let courts = JSON.parse(localStorage.getItem("courts")) || [];

    // Shuffle waiting
    waiting = shuffleArray(waiting);

    // Assign up to 4 players per court
    for (let i = 0; i < courts.length; i++) {
      while (courts[i].players.length < 4 && waiting.length > 0) {
        const player = waiting.shift();
        courts[i].players.push(player);
      }
    }

    // Save
    localStorage.setItem("courts", JSON.stringify(courts));
    localStorage.setItem("waiting2play", JSON.stringify(waiting));

    // Force a page reload so Courts.js sees the new data immediately
    window.location.reload();
  };

  // Move players from courts -> waiting2play
  const movePlayersBackToWaiting = () => {
    let waiting = JSON.parse(localStorage.getItem("waiting2play")) || [];
    let courts = JSON.parse(localStorage.getItem("courts")) || [];

    for (let i = 0; i < courts.length; i++) {
      waiting = waiting.concat(courts[i].players);
      courts[i].players = [];
    }

    localStorage.setItem("courts", JSON.stringify(courts));
    localStorage.setItem("waiting2play", JSON.stringify(waiting));
  };

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // Swap
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  // Edit Timer (dialog)
  const openEditDialog = () => {
    setEditMinutes(Math.floor(timeLeft / 60));
    setShowEditDialog(true);
    // Pause
    setIsRunning(false);
    localStorage.setItem("isRunning", "false");
    localStorage.setItem("timeLeft", timeLeft.toString());
  };

  const saveEdit = () => {
    const newTime = parseInt(editMinutes, 10) * 60;
    setTimeLeft(newTime >= 0 ? newTime : 0);
    setShowEditDialog(false);
    localStorage.setItem("timeLeft", (newTime >= 0 ? newTime : 0).toString());
  };

  const cancelEdit = () => {
    setShowEditDialog(false);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <h1 style={{ fontSize: "3rem", margin: 0 }}>{formatTime(timeLeft)}</h1>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleStartPause} style={{ marginRight: "0.5rem" }}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset} style={{ marginRight: "0.5rem" }}>
          Reset
        </button>
        <button onClick={openEditDialog}>Edit</button>
      </div>

      {/* Edit Timer Dialog */}
      {showEditDialog && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3>Edit Timer (minutes)</h3>
            <input
              type="number"
              value={editMinutes}
              onChange={(e) => setEditMinutes(e.target.value)}
              style={{ width: "60px" }}
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple styles for overlay & dialog
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dialogStyle = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "4px",
  minWidth: "200px",
};

export default Timer;
