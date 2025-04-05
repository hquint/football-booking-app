// import React, { useEffect, useState } from "react";


// function App() {
//   const [players, setPlayers] = useState([]);
//   const [thursdays, setThursdays] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [newPlayerName, setNewPlayerName] = useState(""); // State for new player

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/players/")
//       .then((res) => res.json())
//       .then((data) => setPlayers(data));

//     fetch("http://127.0.0.1:8000/thursdays/")
//       .then((res) => res.json())
//       .then((data) => setThursdays(data));

//     fetch("http://127.0.0.1:8000/attendance/")
//       .then((res) => res.json())
//       .then((data) => {
//         const mapped = {};
//         data.forEach((entry) => {
//           mapped[`${entry.player_id}-${entry.date}`] = entry.status;
//         });
//         setAttendance(mapped);
//       });
//   }, []);

//   // Function to handle adding a new player
//   const addPlayer = () => {
//     if (!newPlayerName.trim()) return; // Prevent empty names

//     fetch("http://127.0.0.1:8000/players/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: newPlayerName, position: "Unknown" }), // Default position
//     })
//       .then(async (res) => {
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.detail); 
//         }
//         return res.json();
//       })
//       .then((newPlayer) => {
//         setPlayers([...players, newPlayer]); // Update the UI
//         setNewPlayerName(""); // Clear input field
//       });
//   };

//   // Function to update attendance
//   const handleAttendance = (player_id, date, status) => {
//     fetch("http://127.0.0.1:8000/attendance/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ player_id, date, status }),
//     }).then(() => {
//       setAttendance((prev) => ({
//         ...prev,
//         [`${player_id}-${date}`]: status,
//       }));
//     });
//   };

//   return (
//     <div>
//       <h1>Football Attendance</h1>

//       {/* Add Player Form */}
//       <div>
//         <input
//           type="text"
//           placeholder="Enter player name"
//           value={newPlayerName}
//           onChange={(e) => setNewPlayerName(e.target.value)}
//         />
//         <button onClick={addPlayer}>Add Player</button>
//       </div>

//       {/* Attendance Table */}
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Player</th>
//             {thursdays.map((date) => (
//               <th key={date}>{date}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {players.map((player) => (
//             <tr key={player.id}>
//               <td>{player.name}</td>
//               {thursdays.map((date) => (
//                 <td key={`${player.id}-${date}`}>
//                   <select
//                     value={attendance[`${player.id}-${date}`] || ""}
//                     onChange={(e) => handleAttendance(player.id, date, e.target.value)}
//                   >
//                     <option value="">Select</option>
//                     <option value="yes">✅</option>
//                     <option value="no">❌</option>
//                     <option value="maybe">⚠️</option>
//                   </select>
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td>Total Attending</td>
//             {thursdays.map((date) => (
//               <td key={`total-${date}`}>
//                 {players.filter(player => attendance[`${player.id}-${date}`] === "yes").length}
//               </td>
//             ))}
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [thursdays, setThursdays] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [newPlayerName, setNewPlayerName] = useState("");

  // Fetch data from the API
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

  // Function to handle attendance updates
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

  // Function to handle adding a new player
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    fetch("http://127.0.0.1:8000/players/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPlayerName, position: "Unknown" }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail);
        }
        return res.json();
      })
      .then((newPlayer) => {
        setPlayers([...players, newPlayer]);
        setNewPlayerName("");
      })
      .catch((error) => alert(error.message));
  };

  // Function to start editing player
  const handleEditPlayer = (playerId, playerName) => {
    setEditingPlayerId(playerId);
    setNewPlayerName(playerName); // pre-fill input with current name
  };

  // Function to save the updated player name
  const handleSavePlayerName = (playerId) => {
    fetch(`http://127.0.0.1:8000/players/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newPlayerName,
        position: "Not provided", // You can include other fields if needed
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers((prev) =>
          prev.map((player) =>
            player.id === playerId ? { ...player, name: newPlayerName } : player
          )
        );
        setEditingPlayerId(null); // Stop editing
      });
  };
 
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Football Attendance</h1>
  
      {/* Add Player Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="p-2 border rounded-lg w-60"
        />
        <button
          onClick={addPlayer}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Player
        </button>
      </div>
  
      {/* Table */}
      <div className="overflow-auto w-full max-w-4xl">
        <table className="w-full border-collapse shadow-lg bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border text-left">Player</th>
              {thursdays.map((date) => (
                <th key={date} className="p-3 border text-center">{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-100">
                <td className="p-3 border flex items-center">
                  {editingPlayerId === player.id ? (
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      className="p-2 border rounded-lg"
                    />
                  ) : (
                    <>
                      <span className="mr-2">{player.name}</span>
                      <button
                        onClick={() => handleEditPlayer(player.id, player.name)}
                        className="text-blue-500"
                      >
                        ✏️
                      </button>
                    </>
                  )}
  
                  {editingPlayerId === player.id && (
                    <button
                      onClick={() => handleSavePlayerName(player.id)}
                      className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                  )}
                </td>
                {thursdays.map((date) => (
                  <td key={`${player.id}-${date}`} className="p-3 border text-center">
                    <select
                      value={attendance[`${player.id}-${date}`] || ""}
                      onChange={(e) => handleAttendance(player.id, date, e.target.value)}
                      className="p-1 border rounded-lg"
                    >
                      <option value="">-</option>
                      <option value="yes">✅ Yes</option>
                      <option value="no">❌ No</option>
                      <option value="maybe">⚠️ Maybe</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
  
          {/* Total Attending */}
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="p-3 border">Total Attending</td>
              {thursdays.map((date) => (
                <td key={`total-${date}`} className="p-3 border text-center">
                  {players.filter(player => attendance[`${player.id}-${date}`] === "yes").length}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default App;
