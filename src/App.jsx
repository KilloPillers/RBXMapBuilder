import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import MapScene from "./Scene.jsx";
import "./App.css";

function App() {

  return (
    <div>
      <h1>My Tauri App with Three.js</h1>
      <MapScene width={3} height={3}/>
    </div> 
  );
}

export default App;
