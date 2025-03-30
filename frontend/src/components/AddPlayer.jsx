import { useState } from "react";  // Import the useState hook from React to manage state

function AddPlayer() {
  // Declare state variables for 'name' and 'position', initializing them as empty strings
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  // This function is triggered when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form behavior (which would refresh the page)
    
    try {
      // Sending a POST request to the FastAPI backend to add the player
      const response = await fetch("http://127.0.0.1:8000/players/", {
        method: "POST", // Use the POST method to create a new player
        headers: {
          "Content-Type": "application/json", // Inform the backend that we're sending JSON data
        },
        body: JSON.stringify({ name, position }), // Send the name and position as JSON in the body of the request
      });

     // Check if the request was successful
     if (response.ok) {
        alert("Player added!");  // If the player is successfully added, show a success message
        setName("");  // Clear the name input field
        setPosition("");  // Clear the position input field
      } else {
        alert("Failed to add player.");  // If the request failed, show an error message
      }
    } catch (error) {
      console.error("Error:", error);  // Log any errors that occur during the request
      alert("Error adding player.");  // Show an error message if an exception occurs
    }
  };

  // Render the form to add a new player
  return (
    <div>
      <h2>Add a Player</h2>  {/* This is the title of the form */}
      <form onSubmit={handleSubmit}>  {/* This form calls the handleSubmit function when submitted */}
        <input
          type="text"  // Text input field
          placeholder="Player Name"  // Placeholder text when the input is empty
          value={name}  // Bind the 'name' state variable to the value of the input field
          onChange={(e) => setName(e.target.value)}  // Update the 'name' state when the input changes
          required  // Ensure this field is filled out before submitting the form
        />
        <input
          type="text"  // Another text input field
          placeholder="Position"  // Placeholder text when the input is empty
          value={position}  // Bind the 'position' state variable to the value of the input field
          onChange={(e) => setPosition(e.target.value)}  // Update the 'position' state when the input changes
          required  // Ensure this field is filled out before submitting the form
        />
        <button type="submit">Add Player</button>  {/* Button to submit the form */}
      </form>
    </div>
  );
}

export default AddPlayer;  // Export the AddPlayer component to be used elsewhere in the app
