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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    if (!isRunning) {
      movePlayersToCourtsRandomly();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    movePlayersBackToWaiting();
    setTimeLeft(defaultTime);
    setIsRunning(false);
    localStorage.setItem("timeLeft", defaultTime.toString());
    localStorage.setItem("isRunning", "false");
    window.location.reload();
  };

  const movePlayersToCourtsRandomly = () => {
    let waiting = JSON.parse(localStorage.getItem("waiting2play")) || [];
    let courts = JSON.parse(localStorage.getItem("courts")) || [];
    waiting = shuffleArray(waiting);

    for (let i = 0; i < courts.length; i++) {
      while (courts[i].players.length < 4 && waiting.length > 0) {
        courts[i].players.push(waiting.shift());
      }
    }

    localStorage.setItem("courts", JSON.stringify(courts));
    localStorage.setItem("waiting2play", JSON.stringify(waiting));
    window.location.reload();
  };

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

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const openEditDialog = () => {
    setEditMinutes(Math.floor(timeLeft / 60));
    setShowEditDialog(true);
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
