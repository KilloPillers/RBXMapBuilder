import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import MapScene from "./Scene.jsx";
import Overlay from "./Overlay.jsx";
import "./App.css";

function App() {

  return (
    <div className="app">
      <div className="scene">
        <MapScene width={10} height={10}/>
      </div>
      <Overlay />
    </div> 
  );
}

export default App;
