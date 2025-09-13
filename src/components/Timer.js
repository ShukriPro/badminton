import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, Edit3 } from "lucide-react";
import alertSound from "../sounds/alert.mp3";
import halfTimeSound from "../sounds/japan_female_hairimashita.mp3";

function Timer() {
  //Load defaultTime from localStorage (fallback to 15 minutes)
  const storedDefaultTime = localStorage.getItem("defaultTime");
  const defaultTime = storedDefaultTime
    ? parseInt(storedDefaultTime, 10)
    : 15 * 60;

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("timeLeft");
    return storedTime ? parseInt(storedTime, 10) : defaultTime;
  });

  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem("isRunning") === "true";
  });

  const [halftimeEnabled, setHalftimeEnabled] = useState(() => {
  const stored = localStorage.getItem("halftimeSound");
  return stored !== "false"; // default = true if not set
});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editMinutes, setEditMinutes] = useState(15);
  const audioRef = useRef(new Audio(alertSound));
  const halfTimeAudioRef = useRef(new Audio(halfTimeSound));

  // Timer countdown logic
  useEffect(() => {
    let timerId;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      // play the sound in half-time
      if (
        localStorage.getItem("halftimeSound") !== "false" &&
        timeLeft === Math.floor(defaultTime / 2)
      ) {
        halfTimeAudioRef.current.play().catch(() => {});
      }

      // 🔔 This is where the sound is played
      if (timeLeft === 10) {
        audioRef.current.play().catch(() => {});
      }
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      localStorage.setItem("isRunning", "false");

      // Move all players back to waiting queue
      movePlayersBackToWaiting();
      // ✅ Always respect last saved custom time
      const resetTime = parseInt(
        localStorage.getItem("defaultTime") || defaultTime,
        10
      );
      setTimeLeft(resetTime);
      localStorage.setItem("timeLeft", resetTime.toString());

      setTimeout(() => {
        movePlayersToCourtsRandomly();
        setIsRunning(true);
        localStorage.setItem("isRunning", "true");
      }, 100);
    }

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft]);

  // Persist timeLeft and isRunning to localStorage
  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft.toString());
    localStorage.setItem("isRunning", isRunning.toString());
  }, [timeLeft, isRunning]);

  //Shortcuts for space (start/pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // prevent page scroll when pressing space
      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, timeLeft]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start or pause the timer, assign players to courts when starting
  const handleStartPause = () => {
    if (!isRunning) {
      // Don't start if timer is 0 or less
      if (timeLeft <= 0) {
        return;
      }
      
      // Only random players if courts are empty
      let courts = JSON.parse(localStorage.getItem("courts")) || [];
      const hasPlayers = courts.some(
        (court) => court.players && court.players.length > 0
      );

      if (!hasPlayers) {
        movePlayersToCourtsRandomly();
      }
    }
    setIsRunning(!isRunning);
  };

  // Reset timer to default time and move all players back to waiting
  const handleReset = () => {
    movePlayersBackToWaiting();
    const storedDefault = localStorage.getItem("defaultTime");
    const resetTime = storedDefault ? parseInt(storedDefault, 10) : 15 * 60;

    setTimeLeft(resetTime);
    setIsRunning(false);

    localStorage.setItem("timeLeft", resetTime.toString());
    localStorage.setItem("isRunning", "false");

    window.location.reload();
  };

  // Randomly assign waiting players to courts (max 4 players per court)
 const movePlayersToCourtsRandomly = () => {
  let waiting = JSON.parse(localStorage.getItem("waiting2play")) || [];
  let courts = JSON.parse(localStorage.getItem("courts")) || [];

  // Shuffle players by gender
  let males = shuffleArray(waiting.filter(p => p.gender === "male"));
  let females = shuffleArray(waiting.filter(p => p.gender === "female"));

  // Split by level
  const splitByLevel = (arr, level) => arr.filter(p => p.level === level);
  let advanced = shuffleArray(waiting.filter(p => p.level === "advanced"));
  let others = shuffleArray(waiting.filter(p => p.level !== "advanced"));

  for (let i = 0; i < courts.length; i++) {
    courts[i].players = [];

    // Add up to 2 advanced players
    for (let a = 0; a < 2 && advanced.length > 0; a++) {
      courts[i].players.push(advanced.shift());
    }

    // Fill remaining slots with intermediate/beginner, respecting max 4 per court
    while (courts[i].players.length < 4 && others.length > 0) {
      courts[i].players.push(others.shift());
    }
  }

  // Any leftover players stay in waiting
  waiting = advanced.concat(others);

  // Save
  localStorage.setItem("courts", JSON.stringify(courts));
  localStorage.setItem("waiting2play", JSON.stringify(waiting));

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
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
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

  // Save new timer duration
  const saveEdit = () => {
    const newTime = parseInt(editMinutes, 10); // already in seconds
    const safeTime = Math.max(0, newTime); // Allow 0 or any positive number

    setTimeLeft(safeTime);
    setShowEditDialog(false);

    localStorage.setItem("timeLeft", safeTime.toString());
    localStorage.setItem("defaultTime", safeTime.toString());
  };
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: '6px',
    background: '#f8f8f8',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ 
      padding: "1rem", 
      borderRadius: "6px", 
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <h1 style={{ 
        fontSize: "3rem", 
        margin: 0,
        textAlign: "center",
        width: "100%"
      }}>{formatTime(timeLeft)}</h1>
      <div style={{ 
        marginTop: "1rem", 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        width: "100%"
      }}>
       <button
  onClick={handleStartPause}
  style={{
    ...buttonStyle,
    background: isRunning ? "#e53935" : "#4caf50", // red for Pause, green for Start
    color: "#fff",
    border: "none",
  }}
  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
>
  {isRunning ? <Pause size={16} /> : <Play size={16} />}
  {isRunning ? "Pause" : "Start"}
</button>

        <button 
          onClick={handleReset}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.background = '#e6e6e6'}
          onMouseOut={(e) => e.currentTarget.style.background = '#f8f8f8'}
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button 
          onClick={openEditDialog}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.background = '#e6e6e6'}
          onMouseOut={(e) => e.currentTarget.style.background = '#f8f8f8'}
        >
          <Edit3 size={16} />
          Edit
        </button>
      </div>
      <p style={{ marginTop: "8px", fontSize: "0.875rem", color: "#666" }}>
        Press <strong>Space</strong> to start/pause
      </p>
      
      <div style={{ 
        marginTop: "16px", 
        textAlign: "center", 
        fontSize: "0.75rem",
        color: "#999"
      }}>
        Version 1.0.0
      </div>

 {showEditDialog && (
  <div style={overlayStyle}>
    <div style={dialogStyle}>
      <h3>Edit Timer</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginTop: "0.5rem",
        }}
      >
        {/* Minutes input */}
        <label style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          Minutes:
          <input
            type="number"
            min="0"
            value={Math.floor(editMinutes / 60)}
            onChange={(e) => {
              const minutes = Math.max(0, +e.target.value);
              const totalSeconds = minutes * 60 + (editMinutes % 60);
              setEditMinutes(totalSeconds);
            }}
            style={{ width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
          />
        </label>

        {/* Seconds input */}
        <label style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          Seconds:
          <input
            type="number"
            min="0"
            max="59"
            value={editMinutes % 60}
            onChange={(e) => {
              const seconds = Math.max(0, Math.min(59, +e.target.value));
              const totalSeconds = Math.floor(editMinutes / 60) * 60 + seconds;
              setEditMinutes(totalSeconds);
            }}
            style={{ width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
          />
        </label>

        {/* ✅ Half-time sound toggle */}
       {/* 🔄 Half-time sound toggle */}
<label style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
  <span>Half-time sound</span>
  <div
    onClick={() => {
      const newValue = !halftimeEnabled;
      setHalftimeEnabled(newValue);
      localStorage.setItem("halftimeSound", newValue ? "true" : "false");
    }}
    style={{
      width: "40px",
      height: "20px",
      borderRadius: "20px",
      background: halftimeEnabled ? "#4caf50" : "#ccc",
      position: "relative",
      cursor: "pointer",
      transition: "background 0.2s",
    }}
  >
    <div
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: "2px",
        left: halftimeEnabled ? "22px" : "2px",
        transition: "left 0.2s",
      }}
    />
  </div>
</label>

      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={saveEdit}
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e6e6e6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f8f8f8")}
        >
          Save
        </button>
        <button
          onClick={() => setShowEditDialog(false)}
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e6e6e6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f8f8f8")}
        >
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
