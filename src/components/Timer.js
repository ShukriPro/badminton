import React, { useEffect, useState, useRef } from "react";
import alertSound from "../sounds/alert.mp3";

function Timer() {
  const defaultTime = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("timeLeft");
    return storedTime ? parseInt(storedTime, 10) : defaultTime;
  });

  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem("isRunning") === "true";
  });

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editMinutes, setEditMinutes] = useState(15);
  const audioRef = useRef(new Audio(alertSound));

  useEffect(() => {
    let timerId;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      if (timeLeft === 60) {
        audioRef.current.play().catch(() => {});
      }
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      localStorage.setItem("isRunning", "false");
      movePlayersBackToWaiting();
      window.location.reload();
      setTimeout(() => {
        setTimeLeft(defaultTime);
        localStorage.setItem("timeLeft", defaultTime.toString());
      }, 100);
    }

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft.toString());
    localStorage.setItem("isRunning", isRunning.toString());
  }, [timeLeft, isRunning]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start or pause the timer, assign players to courts when starting
  const handleStartPause = () => {
    if (!isRunning) {
      movePlayersToCourtsRandomly();
    }
    setIsRunning(!isRunning);
  };

  // Reset timer to default time and move all players back to waiting
  const handleReset = () => {
    movePlayersBackToWaiting();
    setTimeLeft(defaultTime);
    setIsRunning(false);
    localStorage.setItem("timeLeft", defaultTime.toString());
    localStorage.setItem("isRunning", "false");
    window.location.reload();
  };

  // Randomly assign waiting players to courts (max 4 players per court)
  const movePlayersToCourtsRandomly = () => {
  let waiting = JSON.parse(localStorage.getItem("waiting2play")) || [];
  let courts = JSON.parse(localStorage.getItem("courts")) || [];

  // Split by gender and shuffle separately
  let males = shuffleArray(waiting.filter(p => p.gender === "male"));
  let females = shuffleArray(waiting.filter(p => p.gender === "female"));

  // Assign players to courts
  for (let i = 0; i < courts.length; i++) {
    courts[i].players = [];

    // Add up to 2 males
    for (let m = 0; m < 2 && males.length > 0; m++) {
      courts[i].players.push(males.shift());
    }

    // Add up to 2 females
    for (let f = 0; f < 2 && females.length > 0; f++) {
      courts[i].players.push(females.shift());
    }

    // If court not full, fill with leftover players (any gender)
    while (courts[i].players.length < 4 && (males.length > 0 || females.length > 0)) {
      if (males.length > 0) {
        courts[i].players.push(males.shift());
      } else if (females.length > 0) {
        courts[i].players.push(females.shift());
      }
    }
  }

  // Any leftover players remain in waiting queue
  waiting = males.concat(females);

  // Save state
  localStorage.setItem("courts", JSON.stringify(courts));
  localStorage.setItem("waiting2play", JSON.stringify(waiting));

  // Refresh UI
  window.location.reload();
  };


  // Move all players from courts back to the waiting queue
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

  // Randomly shuffle the order of items in an array
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  // Open the edit dialog to change timer duration
  const openEditDialog = () => {
    setEditMinutes(Math.floor(timeLeft / 60));
    setShowEditDialog(true);
    setIsRunning(false);
    localStorage.setItem("isRunning", "false");
    localStorage.setItem("timeLeft", timeLeft.toString());
  };

  // Save the new timer duration and close the edit dialog
  const saveEdit = () => {
    const newTime = parseInt(editMinutes, 10) * 60;
    setTimeLeft(newTime >= 0 ? newTime : 0);
    setShowEditDialog(false);
    localStorage.setItem("timeLeft", (newTime >= 0 ? newTime : 0).toString());
  };

  return (
    <div className=" p-4 rounded text-center">
      <h1 style={{ fontSize: "3rem", margin: 0 }}>{formatTime(timeLeft)}</h1>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={handleStartPause}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={openEditDialog}>Edit</button>
      </div>

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
              <button onClick={() => setShowEditDialog(false)} style={{ marginLeft: "0.5rem" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
