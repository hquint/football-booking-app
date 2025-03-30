import React, { useEffect, useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [thursdays, setThursdays] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [newPlayerName, setNewPlayerName] = useState(""); // State for new player

  useEffect(() => {
    fetch("http://127.0.0.1:8000/players/")
      .then((res) => res.json())
      .then((data) => setPlayers(data));

    fetch("http://127.0.0.1:8000/thursdays/")
      .then((res) => res.json())
      .then((data) => setThursdays(data));

    fetch("http://127.0.0.1:8000/attendance/")
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};
        data.forEach((entry) => {
          mapped[`${entry.player_id}-${entry.date}`] = entry.status;
        });
        setAttendance(mapped);
      });
  }, []);

  // Function to handle adding a new player
  const addPlayer = () => {
    if (!newPlayerName.trim()) return; // Prevent empty names

    fetch("http://127.0.0.1:8000/players/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPlayerName, position: "Unknown" }), // Default position
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail); 
        }
        return res.json();
      })
      .then((newPlayer) => {
        setPlayers([...players, newPlayer]); // Update the UI
        setNewPlayerName(""); // Clear input field
      });
  };

  // Function to update attendance
  const handleAttendance = (player_id, date, status) => {
    fetch("http://127.0.0.1:8000/attendance/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_id, date, status }),
    }).then(() => {
      setAttendance((prev) => ({
        ...prev,
        [`${player_id}-${date}`]: status,
      }));
    });
  };

  return (
    <div>
      <h1>Football Attendance</h1>

      {/* Add Player Form */}
      <div>
        <input
          type="text"
          placeholder="Enter player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>

      {/* Attendance Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Player</th>
            {thursdays.map((date) => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              {thursdays.map((date) => (
                <td key={`${player.id}-${date}`}>
                  <select
                    value={attendance[`${player.id}-${date}`] || ""}
                    onChange={(e) => handleAttendance(player.id, date, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="yes">✅</option>
                    <option value="no">❌</option>
                    <option value="maybe">⚠️</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total Attending</td>
            {thursdays.map((date) => (
              <td key={`total-${date}`}>
                {players.filter(player => attendance[`${player.id}-${date}`] === "yes").length}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;