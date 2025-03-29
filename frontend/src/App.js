//import logo from './logo.svg';
import './App.css';
import AddPlayer from './components/AddPlayer';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  return (
    <div className="App">  {/* This is the main wrapper div for the app */}
      <h1>Football Team Manager</h1>  {/* Header for the app */}
      <AddPlayer />  {/* Render the AddPlayer component */}
    </div>
  );
}

export default App; // Export App to be used in index.js
