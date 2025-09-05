import React, { useEffect, useState, useRef } from "react";
import alertSound from "../sounds/alert.mp3";

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

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editMinutes, setEditMinutes] = useState(15);
  const audioRef = useRef(new Audio(alertSound));
  // Timer countdown logic
  useEffect(() => {
    let timerId;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      // 🔔 This is where the sound is played
      if (timeLeft === 10) {
        audioRef.current.play().catch(() => {});
      }
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      localStorage.setItem("isRunning", "false");

      movePlayersBackToWaiting();

      // Get the last edited/saved time instead of default
      const lastSaved = localStorage.getItem("defaultTime");
      const resetTime = lastSaved ? parseInt(lastSaved, 10) : defaultTime;

      setTimeout(() => {
        setTimeLeft(resetTime);
        localStorage.setItem("timeLeft", resetTime.toString());
        window.location.reload();
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

    // Split by gender and shuffle separately
    let males = shuffleArray(waiting.filter((p) => p.gender === "male"));
    let females = shuffleArray(waiting.filter((p) => p.gender === "female"));

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
      while (
        courts[i].players.length < 4 &&
        (males.length > 0 || females.length > 0)
      ) {
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
    const safeTime = newTime >= 0 ? newTime : 0;

    setTimeLeft(safeTime);
    setShowEditDialog(false);

    localStorage.setItem("timeLeft", safeTime.toString());
    localStorage.setItem("defaultTime", safeTime.toString());
  };
  return (
    <div className=" p-4 rounded text-center">
      <h1 style={{ fontSize: "3rem", margin: 0 }}>{formatTime(timeLeft)}</h1>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={openEditDialog}>Edit</button>
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
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                Minutes:
                <input
                  type="number"
                  min="0"
                  value={Math.floor(editMinutes / 60)}
                  onChange={(e) =>
                    setEditMinutes(+e.target.value * 60 + (editMinutes % 60))
                  }
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.5rem",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                Seconds:
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={editMinutes % 60}
                  onChange={(e) =>
                    setEditMinutes(
                      Math.floor(editMinutes / 60) * 60 + +e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.5rem",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setShowEditDialog(false)}>Cancel</button>
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
